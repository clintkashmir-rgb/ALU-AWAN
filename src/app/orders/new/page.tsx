
"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Save, CheckCircle, AlertTriangle } from "lucide-react"
import { Section } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { collection, serverTimestamp } from "firebase/firestore"
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { useRouter } from "next/navigation"
import { WindowDrawing } from "@/components/WindowDrawing"

export default function NewOrderPage() {
  const { user, isUserLoading } = useUser()
  const { toast } = useToast()
  const firestore = useFirestore()
  const router = useRouter()
  
  React.useEffect(() => {
    if (!isUserLoading && !user) router.push("/login")
  }, [user, isUserLoading, router])

  const [customerName, setCustomerName] = React.useState("")
  const [width, setWidth] = React.useState("4")
  const [height, setHeight] = React.useState("4")
  const [palla, setPalla] = React.useState("2")
  const [qty, setQty] = React.useState("1")
  const [glassRate, setGlassRate] = React.useState("120")
  const [windowType, setWindowType] = React.useState<'Sliding' | 'Fixed'>('Sliding')
  const [discountPercent, setDiscountPercent] = React.useState(0)
  const [showResults, setShowResults] = React.useState(false)

  const sectionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "sections");
  }, [firestore, user]);
  
  const { data: allSections } = useCollection<Section>(sectionsQuery);

  const configuredSections = React.useMemo(() => {
    return allSections?.filter(s => 
      (s.top_formula && s.top_formula !== 'None') || 
      (s.bottom_formula && s.bottom_formula !== 'None') || 
      (s.side_formula && s.side_formula !== 'None')
    ) || []
  }, [allSections])

  const glassSqFt = React.useMemo(() => {
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    const q = parseInt(qty) || 0
    return parseFloat((w * h * q).toFixed(2))
  }, [width, height, qty])

  const evaluateFormula = (formula: string | undefined, w: number, h: number): number => {
    try {
      if (!formula || formula === 'None') return 0
      const parts = formula.split(/\s+/)
      if (parts.length < 3) return 0
      const varVal = parts[0] === 'Width' ? w : parts[0] === 'Height' ? h : 0
      const op = parts[1]; 
      const val = parseFloat(parts[2]) || 0
      if (op === '+') return varVal + val
      if (op === '-') return varVal - val
      if (op === '*') return varVal * val
      if (op === '/') return val !== 0 ? varVal / val : 0
      return 0
    } catch { return 0 }
  }

  const comparisonData = React.useMemo(() => {
    if (!showResults || !configuredSections) return []
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    const q = parseInt(qty) || 0

    return configuredSections.map(s => {
      const top = evaluateFormula(s.top_formula, w, h)
      const bottom = evaluateFormula(s.bottom_formula, w, h)
      const side = evaluateFormula(s.side_formula, w, h)
      const totalFt = (top + bottom + (2 * side)) * q
      const rate = s.rate_per_ft || 220
      return { 
        id: s.id, 
        name: s.name, 
        totalFt: parseFloat(totalFt.toFixed(2)), 
        rate, 
        amount: Math.round(totalFt * rate) 
      }
    })
  }, [width, height, qty, configuredSections, showResults])

  const glassAmount = Math.round(glassSqFt * (parseFloat(glassRate) || 0))
  const selectedProfileAmount = comparisonData[0]?.amount || 0
  const grandTotal = Math.round((glassAmount + selectedProfileAmount) * (1 - discountPercent / 100))

  const handleCalculate = () => {
    if (!width || !height || !qty) {
      toast({ variant: "destructive", title: "Missing Inputs" })
      return
    }
    if (configuredSections.length === 0) {
      toast({ variant: "destructive", title: "No Logic Found", description: "Set formulas in Formula Builder first." })
      return
    }
    setShowResults(true)
  }

  const handleSaveOrder = () => {
    if (!customerName || !firestore) {
      toast({ variant: "destructive", title: "Customer Name Required" })
      return
    }

    addDocumentNonBlocking(collection(firestore, "invoices"), {
      customerName,
      date: new Date().toLocaleDateString(),
      width: parseFloat(width),
      height: parseFloat(height),
      palla: parseInt(palla),
      qty: parseInt(qty),
      type: windowType,
      glassSqFt,
      netAmount: grandTotal,
      status: "Paid",
      timestamp: serverTimestamp()
    });

    toast({ title: "Order Saved Successfully" })
    router.push("/")
  }

  if (isUserLoading || !user) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="ml-2 font-headline text-xl font-bold uppercase tracking-tight">New Order Processing</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
          <Card className="border-none shadow-xl bg-card">
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Customer Name</Label>
                  <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Enter name..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Type</Label>
                  <Select value={windowType} onValueChange={(v: any) => { setWindowType(v); setShowResults(false); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sliding">Sliding</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Width (ft)</Label>
                  <Input type="number" step="any" className="font-bold text-center" value={width} onChange={e => { setWidth(e.target.value); setShowResults(false); }} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Height (ft)</Label>
                  <Input type="number" step="any" className="font-bold text-center" value={height} onChange={e => { setHeight(e.target.value); setShowResults(false); }} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Palla</Label>
                  <Select value={palla} onValueChange={(v) => { setPalla(v); setShowResults(false); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Palla</SelectItem>
                      <SelectItem value="3">3 Palla</SelectItem>
                      <SelectItem value="4">4 Palla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Qty</Label>
                  <Input type="number" className="font-bold text-center" value={qty} onChange={e => { setQty(e.target.value); setShowResults(false); }} />
                </div>
              </div>

              {configuredSections.length === 0 && (
                <div className="p-4 bg-destructive/10 border border-dashed border-destructive/30 rounded-xl flex flex-col items-center justify-center gap-2 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                  <p className="text-[10px] font-black uppercase text-center">No logic configured. Set formulas in Formula Builder first to see prices.</p>
                </div>
              )}

              <Button onClick={handleCalculate} className="w-full h-14 font-black bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg rounded-xl gap-2 transition-all transform active:scale-[0.98]" disabled={configuredSections.length === 0}>
                <CheckCircle className="h-5 w-5" /> OK - RUN CALCULATION
              </Button>
            </CardContent>
          </Card>

          {showResults && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg bg-white p-6 flex items-center justify-center">
                  <WindowDrawing width={parseFloat(width)} height={parseFloat(height)} type={windowType} />
                </Card>
                <Card className="md:col-span-2 border-none shadow-lg bg-accent/5 border-2 border-dashed border-accent/20">
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex justify-between items-center p-4 bg-background rounded-lg border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Calculated Area: {width} x {height} ft</span>
                      <span className="text-2xl font-black text-accent">{glassSqFt} Sqft</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground tracking-tighter">Glass Rate (PKR/Sqft)</Label>
                        <Input type="number" className="font-black h-12 text-lg" value={glassRate} onChange={e => setGlassRate(e.target.value)} />
                      </div>
                      <div className="text-right space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground tracking-tighter">Glass Total Cost</Label>
                        <div className="text-3xl font-black text-accent leading-none">PKR {glassAmount.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-xl overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 py-3"><CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price Comparison by Profile</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader><TableRow className="bg-muted/50 border-b"><TableHead className="font-black uppercase text-[10px]">Profile Name</TableHead><TableHead className="text-right font-black uppercase text-[10px]">Total Length</TableHead><TableHead className="text-right font-black uppercase text-[10px]">Unit Rate</TableHead><TableHead className="text-right font-black uppercase text-[10px]">Total Amount</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {comparisonData.map(s => (
                        <TableRow key={s.id} className="hover:bg-muted/10 border-b">
                          <TableCell className="font-black text-accent">{s.name}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{s.totalFt} ft</TableCell>
                          <TableCell className="text-right text-[10px] opacity-70">PKR {s.rate}/ft</TableCell>
                          <TableCell className="text-right font-black text-xl">PKR {s.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row items-end justify-between bg-card p-8 rounded-2xl shadow-2xl border-2 border-accent/20 gap-6">
                <div className="w-full md:w-48 space-y-2">
                  <Label className="text-[8px] uppercase font-black tracking-widest text-muted-foreground">Special Discount (%)</Label>
                  <Input type="number" className="h-12 text-xl font-black" value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="text-right flex-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Final Payable Grand Total</p>
                  <p className="text-6xl font-black text-accent tracking-tighter leading-none">PKR {grandTotal.toLocaleString()}</p>
                </div>
                <Button onClick={handleSaveOrder} className="h-16 px-12 bg-primary text-primary-foreground text-xl font-black rounded-xl shadow-xl gap-2 hover:bg-primary/90 transition-all uppercase">
                  <Save className="h-6 w-6" /> SAVE ORDER & CLOSE
                </Button>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
