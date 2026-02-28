
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
import { Plus, Trash2, Calculator, Ruler, Package, Printer, X, PlusCircle } from "lucide-react"
import { WindowItem, Section, Colour, HardwareItem } from "@/lib/types"
import { mockSections, mockColours, mockGlassTypes } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { WindowDrawing } from "@/components/WindowDrawing"

interface HardwareRow {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function NewOrderPage() {
  const { toast } = useToast()
  const [items, setItems] = React.useState<WindowItem[]>([])
  const [discountPercent, setDiscountPercent] = React.useState(0)
  const [sections, setSections] = React.useState(mockSections)
  
  // Hardware Table State
  const [hardwareRows, setHardwareRows] = React.useState<HardwareRow[]>([
    { id: "1", description: "", quantity: 1, rate: 0 }
  ])

  // Load persisted sections
  React.useEffect(() => {
    const saved = localStorage.getItem('awan_sections')
    if (saved) {
      setSections(JSON.parse(saved))
    }
  }, [])

  // Form State
  const [formType, setFormType] = React.useState<'Fixed' | 'Sliding'>('Sliding')
  const [formColourId, setFormColourId] = React.useState(mockColours[0].id)
  const [formGlassType, setFormGlassType] = React.useState(mockGlassTypes[0].id)
  const [formWidth, setFormWidth] = React.useState("")
  const [formHeight, setFormHeight] = React.useState("")
  const [formQty, setFormQty] = React.useState("1")
  
  const selectedColour = mockColours.find(c => c.id === formColourId) || mockColours[0]

  const handleAddHardwareRow = () => {
    setHardwareRows([...hardwareRows, { id: Math.random().toString(), description: "", quantity: 1, rate: 0 }])
  }

  const handleRemoveHardwareRow = (id: string) => {
    if (hardwareRows.length > 1) {
      setHardwareRows(hardwareRows.filter(r => r.id !== id))
    }
  }

  const updateHardwareRow = (id: string, field: keyof HardwareRow, value: any) => {
    setHardwareRows(hardwareRows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const totalHardwareAmount = hardwareRows.reduce((sum, r) => sum + (r.quantity * r.rate), 0)

  // Evaluation logic
  const evaluate = (formula: string, w: number, h: number): number => {
    try {
      if (!formula || formula === 'None') return 0;
      const parts = formula.split(' ');
      if (parts.length < 3) return 0;
      const variableName = parts[0];
      const variable = variableName === 'Width' ? w : variableName === 'Height' ? h : 0;
      if (variableName === 'None') return 0;
      const operator = parts[1];
      const constant = parseFloat(parts[2]);
      let res = 0;
      if (operator === '+') res = variable + constant;
      else if (operator === '-') res = variable - constant;
      else if (operator === '*') res = variable * constant;
      else if (operator === '/') res = constant !== 0 ? variable / constant : 0;
      return res > 0 ? res : 0;
    } catch { return 0; }
  }

  const calculateAllSections = (w: number, h: number, q: number, colour: Colour, hardwareCostTotal: number, windowType: 'Sliding' | 'Fixed') => {
    return sections
      .filter(section => (section.type === windowType || section.type === 'Both') && (section.top_formula !== 'None' || section.bottom_formula !== 'None' || section.side_formula !== 'None'))
      .map(section => {
        let frameRate = 220;
        if (section.rates && colour.category) {
          frameRate = section.rates[colour.category] || 220;
        } else if (section.rate_per_ft) {
          frameRate = section.rate_per_ft;
        }

        const glassObj = mockGlassTypes.find(g => g.id === formGlassType)
        const glassRate = glassObj?.rate_per_sqft || 120
        const topFt = evaluate(section.top_formula, w, h);
        const bottomFt = evaluate(section.bottom_formula, w, h);
        const sideFt = evaluate(section.side_formula, w, h);
        const frameFtPerWindow = topFt + bottomFt + (2 * sideFt);
        
        if (frameFtPerWindow <= 0) return null;

        const totalFrameFt = frameFtPerWindow * q;
        const glassArea = Math.max(0, (w - 0.2) * (h - 0.2)) * q
        const frameCost = totalFrameFt * frameRate
        const glassCost = glassArea * glassRate

        return {
          sectionName: section.name,
          sectionId: section.id,
          frameFt: parseFloat(totalFrameFt.toFixed(2)),
          glassSqFt: parseFloat(glassArea.toFixed(2)),
          totalCost: Math.round(frameCost + glassCost + hardwareCostTotal),
          frameCost: Math.round(frameCost),
          glassCost: Math.round(glassCost),
          hardwareCost: hardwareCostTotal,
          topFt, bottomFt, sideFt
        }
      })
      .filter((calc): calc is NonNullable<typeof calc> => calc !== null);
  }

  const addItem = () => {
    if (!formWidth || !formHeight) {
      toast({ variant: "destructive", title: "Missing Input", description: "Width and Height are required." })
      return
    }

    const w = parseFloat(formWidth)
    const h = parseFloat(formHeight)
    const q = parseInt(formQty)
    
    const comparisons = calculateAllSections(w, h, q, selectedColour, totalHardwareAmount, formType)
    
    if (comparisons.length === 0) {
      toast({ variant: "destructive", title: "No Formula", description: `Add formulas for ${formType} sections.` })
      return
    }

    const defaultCalc = comparisons[0]

    const newItem: WindowItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: formType,
      pallaQty: 2,
      colour: selectedColour.name,
      glassType: mockGlassTypes.find(g => g.id === formGlassType)?.name || 'Standard',
      width: w,
      height: h,
      quantity: q,
      frameFt: defaultCalc.frameFt,
      glassSqFt: defaultCalc.glassSqFt,
      frameCost: defaultCalc.frameCost,
      glassCost: defaultCalc.glassCost,
      hardwareCost: totalHardwareAmount,
      totalCost: defaultCalc.totalCost,
      sectionId: defaultCalc.sectionId
    }

    setItems([...items, newItem])
    setFormWidth("")
    setFormHeight("")
    setHardwareRows([{ id: "1", description: "", quantity: 1, rate: 0 }])
    toast({ title: "Item Added" })
  }

  const grossAmount = items.reduce((sum, item) => sum + item.totalCost, 0)
  const netAmount = Math.max(0, grossAmount * (1 - discountPercent / 100))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 w-full print:hidden">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="font-headline text-xl font-bold">New Order</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/inventory/formulas"><Calculator className="h-4 w-4 mr-2" /> Formulas</Link>
            </Button>
            {items.length > 0 && (
              <Button size="sm" className="bg-accent text-accent-foreground" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 pb-24 w-full max-w-full print:p-0">
          <Card className="border-none shadow-lg print:hidden">
            <CardHeader className="p-4"><CardTitle className="text-sm">Window Details</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 space-y-6">
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formType} onValueChange={(v: any) => setFormType(v)}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Sliding">Sliding</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Colour</Label>
                  <Select value={formColourId} onValueChange={setFormColourId}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>{mockColours.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Width (ft)</Label>
                  <Input type="number" className="h-11" value={formWidth} onChange={e => setFormWidth(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Height (ft)</Label>
                  <Input type="number" className="h-11" value={formHeight} onChange={e => setFormHeight(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" className="h-11" value={formQty} onChange={e => setFormQty(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Glass Type</Label>
                  <Select value={formGlassType} onValueChange={setFormGlassType}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>{mockGlassTypes.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold flex items-center gap-2"><Package className="h-4 w-4" /> Hardware Items</Label>
                  <Button variant="ghost" size="sm" onClick={handleAddHardwareRow} className="text-accent gap-1">
                    <PlusCircle className="h-3 w-3" /> Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {hardwareRows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                      <Input 
                        placeholder="Description" 
                        className="col-span-5 h-9 text-xs" 
                        value={row.description} 
                        onChange={(e) => updateHardwareRow(row.id, 'description', e.target.value)} 
                      />
                      <Input 
                        type="number" 
                        placeholder="Qty" 
                        className="col-span-2 h-9 text-xs" 
                        value={row.quantity} 
                        onChange={(e) => updateHardwareRow(row.id, 'quantity', parseInt(e.target.value) || 0)} 
                      />
                      <Input 
                        type="number" 
                        placeholder="Rate" 
                        className="col-span-3 h-9 text-xs" 
                        value={row.rate} 
                        onChange={(e) => updateHardwareRow(row.id, 'rate', parseFloat(e.target.value) || 0)} 
                      />
                      <div className="col-span-2 flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveHardwareRow(row.id)} className="h-8 w-8 text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2 border-t text-xs font-bold text-accent">
                  Total Hardware: PKR {totalHardwareAmount.toLocaleString()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <Button onClick={addItem} className="w-full h-12 bg-accent text-accent-foreground">
                <Plus className="h-5 w-5 mr-2" /> Add to List
              </Button>
            </CardFooter>
          </Card>

          {items.map((item, idx) => (
            <Card key={item.id} className="border shadow-lg p-4 grid md:grid-cols-12 gap-4 break-inside-avoid">
              <div className="md:col-span-1 flex items-center justify-center font-black text-2xl text-accent/20">{idx + 1}</div>
              <div className="md:col-span-3 flex justify-center"><WindowDrawing width={item.width} height={item.height} type={item.type} /></div>
              <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1"><p className="text-muted-foreground uppercase font-black">Specs</p><p className="font-bold">{item.width} x {item.height} ft</p><p>{item.colour}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground uppercase font-black">Frame</p><p className="font-bold">{item.frameFt} ft</p><p>PKR {item.frameCost}</p></div>
                <div className="space-y-1"><p className="text-muted-foreground uppercase font-black">Glass</p><p className="font-bold">{item.glassSqFt} sqft</p><p>PKR {item.glassCost}</p></div>
                <div className="flex flex-col justify-between items-end">
                  <div className="text-right"><p className="text-muted-foreground uppercase font-black">Amount</p><p className="text-lg font-black text-accent">PKR {item.totalCost.toLocaleString()}</p></div>
                  <Button variant="ghost" size="icon" className="text-destructive print:hidden" onClick={() => setItems(items.filter(i => i.id !== item.id))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </Card>
          ))}

          {items.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 print:mt-8">
              <Card className="bg-accent/5 p-4 space-y-2">
                <div className="flex justify-between text-sm"><span>Total Frame</span><span className="font-bold">PKR {items.reduce((s, i) => s + i.frameCost, 0).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Total Glass</span><span className="font-bold">PKR {items.reduce((s, i) => s + i.glassCost, 0).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Total Hardware</span><span className="font-bold">PKR {items.reduce((s, i) => s + i.hardwareCost, 0).toLocaleString()}</span></div>
                <div className="pt-2 border-t-2 border-dashed flex justify-between font-black text-xl"><span>GROSS</span><span className="text-accent">PKR {grossAmount.toLocaleString()}</span></div>
              </Card>
              <Card className="p-4 space-y-4">
                <div className="flex justify-between items-end"><Label className="text-xs uppercase font-black">Discount (%)</Label><span className="text-lg font-black text-accent">PKR {netAmount.toLocaleString()}</span></div>
                <Input type="number" className="h-11" value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} />
              </Card>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
