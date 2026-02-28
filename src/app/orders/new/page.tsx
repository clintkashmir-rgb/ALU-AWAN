
"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Calculator, Ruler, Package, Printer, X, PlusCircle, Save, Info } from "lucide-react"
import { WindowItem, Section, Colour, Rate } from "@/lib/types"
import { mockColours, mockRates } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { addDoc, collection } from "firebase/firestore"
import { useFirestore } from "@/firebase/provider"
import { useRouter } from "next/navigation"

interface HardwareRow {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function NewOrderPage() {
  const { toast } = useToast()
  const firestore = useFirestore()
  const router = useRouter()
  
  // Persisted Logic
  const [sections, setSections] = React.useState<Section[]>([])
  const [customerName, setCustomerName] = React.useState("")
  const [discountPercent, setDiscountPercent] = React.useState(0)
  
  // Inputs
  const [width, setWidth] = React.useState("4")
  const [height, setHeight] = React.useState("4")
  const [qty, setQty] = React.useState("1")
  const [glassRate, setGlassRate] = React.useState("120")
  const [windowType, setWindowType] = React.useState<'Sliding' | 'Fixed'>('Sliding')
  
  // Hardware List
  const [hardware, setHardware] = React.useState<HardwareRow[]>([
    { id: "1", description: "", quantity: 1, rate: 0 }
  ])

  React.useEffect(() => {
    const saved = localStorage.getItem('awan_sections')
    if (saved) setSections(JSON.parse(saved))
  }, [])

  // Optimized Calculations
  const glassSqFt = React.useMemo(() => {
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    const q = parseInt(qty) || 0
    return parseFloat((w * h * q).toFixed(2))
  }, [width, height, qty])

  const glassAmount = React.useMemo(() => {
    return Math.round(glassSqFt * (parseFloat(glassRate) || 0))
  }, [glassSqFt, glassRate])

  const hardwareAmount = React.useMemo(() => {
    return hardware.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  }, [hardware])

  const evaluateFormula = (formula: string, w: number, h: number): number => {
    try {
      if (!formula || formula === 'None') return 0
      const parts = formula.split(' ')
      const variable = parts[0] === 'Width' ? w : parts[0] === 'Height' ? h : 0
      const op = parts[1]
      const val = parseFloat(parts[2]) || 0
      if (op === '+') return variable + val
      if (op === '-') return variable - val
      if (op === '*') return variable * val
      if (op === '/') return val !== 0 ? variable / val : 0
      return 0
    } catch { return 0 }
  }

  const comparisonData = React.useMemo(() => {
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    const q = parseInt(qty) || 0

    return sections
      .filter(s => (s.type === windowType || s.type === 'Both') && (s.top_formula !== 'None' || s.bottom_formula !== 'None'))
      .map(s => {
        const top = evaluateFormula(s.top_formula, w, h)
        const bottom = evaluateFormula(s.bottom_formula, w, h)
        const side = evaluateFormula(s.side_formula, w, h)
        const totalFt = (top + bottom + (2 * side)) * q
        const rate = s.rate_per_ft || 220
        return {
          id: s.id,
          name: s.name,
          totalFt: parseFloat(totalFt.toFixed(2)),
          rate: rate,
          amount: Math.round(totalFt * rate)
        }
      })
  }, [width, height, qty, sections, windowType])

  const handleAddHardware = () => {
    setHardware([...hardware, { id: Math.random().toString(), description: "", quantity: 1, rate: 0 }])
  }

  const handleSaveOrder = async () => {
    if (!customerName) {
      toast({ variant: "destructive", title: "Missing Info", description: "Customer name is required." })
      return
    }

    const netAmount = Math.round((glassAmount + hardwareAmount + (comparisonData[0]?.amount || 0)) * (1 - discountPercent / 100))

    try {
      await addDoc(collection(firestore, "orders"), {
        customerName,
        date: new Date().toLocaleDateString(),
        glassAmount,
        hardwareAmount,
        netAmount,
        status: "Completed",
        items: [{ width, height, qty, type: windowType }]
      })
      toast({ title: "Order Recorded", description: "The invoice has been saved to history." })
      router.push("/invoices")
    } catch (e) {
      toast({ variant: "destructive", title: "Save Failed" })
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="font-headline text-xl font-bold">New Window Calculation</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden"><Printer className="h-4 w-4 mr-2" /> Print Preview</Button>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-full print:p-0">
          {/* Main Inputs */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border-none shadow-xl print:shadow-none">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Window & Customer Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Customer Name</Label>
                    <Input placeholder="Enter customer name..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={windowType} onValueChange={(v: any) => setWindowType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Sliding">Sliding</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" value={qty} onChange={e => setQty(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Width (ft)</Label>
                    <Input type="number" value={width} onChange={e => setWidth(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (ft)</Label>
                    <Input type="number" value={height} onChange={e => setHeight(e.target.value)} />
                  </div>
                </div>

                {/* Glass Calculation Box */}
                <div className="p-4 bg-accent/5 border-2 border-dashed border-accent/20 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-2"><Calculator className="h-4 w-4" /> Glass Calculation</h3>
                    <div className="text-[10px] font-mono bg-accent/10 px-2 py-0.5 rounded text-accent">W × H × Q = {glassSqFt} sqft</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground uppercase">Rate per Sqft (PKR)</Label>
                      <Input type="number" value={glassRate} onChange={e => setGlassRate(e.target.value)} className="h-10 text-lg font-bold" />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <Label className="text-[10px] text-muted-foreground uppercase">Total Glass Amount</Label>
                      <div className="h-10 flex items-center justify-end text-xl font-black text-accent">PKR {glassAmount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hardware List */}
            <Card className="border-none shadow-lg print:hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Hardware Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleAddHardware} className="h-7 text-accent"><PlusCircle className="h-3 w-3 mr-1" /> Add</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {hardware.map((h) => (
                  <div key={h.id} className="grid grid-cols-12 gap-1 items-center bg-muted/20 p-1 rounded-md">
                    <Input placeholder="Item" className="col-span-5 h-8 text-[10px]" value={h.description} onChange={e => setHardware(hardware.map(i => i.id === h.id ? {...i, description: e.target.value} : i))} />
                    <Input type="number" placeholder="Qty" className="col-span-2 h-8 text-[10px]" value={h.quantity} onChange={e => setHardware(hardware.map(i => i.id === h.id ? {...i, quantity: parseInt(e.target.value) || 0} : i))} />
                    <Input type="number" placeholder="Rate" className="col-span-3 h-8 text-[10px]" value={h.rate} onChange={e => setHardware(hardware.map(i => i.id === h.id ? {...i, rate: parseFloat(e.target.value) || 0} : i))} />
                    <Button variant="ghost" size="icon" className="col-span-2 h-7 w-7 text-destructive" onClick={() => setHardware(hardware.filter(i => i.id !== h.id))}><X className="h-3 w-3" /></Button>
                  </div>
                ))}
                <div className="pt-2 border-t text-right font-black text-accent text-xs">PKR {hardwareAmount.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Section Comparison Table */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-sm font-bold">Aluminum Profile Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Profile (Section)</TableHead>
                    <TableHead className="text-right">Total Frame (ft)</TableHead>
                    <TableHead className="text-right">Rate (/ft)</TableHead>
                    <TableHead className="text-right">Total Frame Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-xs text-muted-foreground">No formulas defined for {windowType} sections.</TableCell></TableRow>
                  ) : comparisonData.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-bold">{s.name}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{s.totalFt} ft</TableCell>
                      <TableCell className="text-right text-xs">PKR {s.rate}</TableCell>
                      <TableCell className="text-right font-bold text-accent">PKR {s.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Final Summary & Save */}
          <div className="flex flex-col md:flex-row gap-6 items-end justify-between pt-4 pb-12">
            <div className="w-full md:w-64 space-y-2">
              <Label className="text-[10px] uppercase font-black">Discount (%)</Label>
              <Input type="number" value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} className="h-12 text-lg" />
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Grand Total Amount</p>
              <h2 className="text-4xl font-black text-accent">PKR {Math.round((glassAmount + hardwareAmount + (comparisonData[0]?.amount || 0)) * (1 - discountPercent / 100)).toLocaleString()}</h2>
              <Button onClick={handleSaveOrder} className="mt-4 h-14 px-12 bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-black shadow-2xl rounded-xl gap-3">
                <Save className="h-6 w-6" /> SAVE ORDER & RECORD INVOICE
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
