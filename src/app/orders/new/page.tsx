"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Calculator, Ruler, Package, Printer, FileDown } from "lucide-react"
import { WindowItem, Section, Colour } from "@/lib/types"
import { mockSections, mockColours, mockGlassTypes } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"
import { WindowDrawing } from "@/components/WindowDrawing"

export default function NewOrderPage() {
  const { toast } = useToast()
  const [items, setItems] = React.useState<WindowItem[]>([])
  const [discountPercent, setDiscountPercent] = React.useState(0)
  const [sections, setSections] = React.useState(mockSections)
  
  // Load persisted sections from LocalStorage
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
  
  // Manual Hardware State
  const [manualHardwareCost, setManualHardwareCost] = React.useState("0")

  const selectedColour = mockColours.find(c => c.id === formColourId) || mockColours[0]

  // Evaluate dynamic formula string
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
    } catch {
      return 0;
    }
  }

  const calculateAllSections = (w: number, h: number, q: number, colour: Colour, hardwareCost: number, windowType: 'Sliding' | 'Fixed') => {
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

        const deduction = 0.1
        
        const topFt = evaluate(section.top_formula, w, h);
        const bottomFt = evaluate(section.bottom_formula, w, h);
        const sideFt = evaluate(section.side_formula, w, h);

        const frameFtPerWindow = (topFt > 0 ? topFt : 0) + (bottomFt > 0 ? bottomFt : 0) + (2 * (sideFt > 0 ? sideFt : 0));
        
        if (frameFtPerWindow <= 0) return null;

        const totalFrameFt = frameFtPerWindow * q;
        const glassArea = Math.max(0, (w - (2 * deduction)) * (h - (2 * deduction))) * q

        const frameCost = totalFrameFt * frameRate
        const glassCost = glassArea * glassRate
        const totalHardwareCost = hardwareCost * q

        return {
          sectionName: section.name,
          sectionId: section.id,
          frameFt: parseFloat(totalFrameFt.toFixed(2)),
          glassSqFt: parseFloat(glassArea.toFixed(2)),
          totalCost: Math.round(frameCost + glassCost + totalHardwareCost),
          frameCost: Math.round(frameCost),
          glassCost: Math.round(glassCost),
          hardwareCost: totalHardwareCost,
          rateApplied: frameRate,
          topFt,
          bottomFt,
          sideFt
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
    const hwCost = parseFloat(manualHardwareCost) || 0
    
    const comparisons = calculateAllSections(w, h, q, selectedColour, hwCost, formType)
    
    if (comparisons.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "No Formula Found", 
        description: `Configure formulas for ${formType} sections first.` 
      })
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
      hardwareCost: defaultCalc.hardwareCost,
      totalCost: defaultCalc.totalCost,
      sectionId: defaultCalc.sectionId
    }

    setItems([...items, newItem])
    setFormWidth("")
    setFormHeight("")
    setManualHardwareCost("0")
    toast({ title: "Item Added", description: "Window calculations added to list." })
  }

  const handlePrint = () => {
    window.print()
  }

  const grossAmount = items.reduce((sum, item) => sum + item.totalCost, 0)
  const netAmount = Math.max(0, grossAmount * (1 - discountPercent / 100))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden max-w-full">
        {/* Print Only Header */}
        <div className="hidden print:block mb-8 text-center border-b pb-4">
          <h1 className="text-3xl font-black text-primary">AWAN ALUMINUM</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Order Cutting & Specification Sheet</p>
          <div className="flex justify-between mt-4 text-[10px] font-bold">
            <span>DATE: {new Date().toLocaleDateString()}</span>
            <span>ORDER ID: #AW-{Math.floor(Math.random() * 10000)}</span>
          </div>
        </div>

        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 w-full print:hidden">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="font-headline text-xl font-bold truncate">New Order</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-accent text-accent" asChild>
              <Link href="/inventory/formulas">
                <Calculator className="h-4 w-4" /> Formulas
              </Link>
            </Button>
            {items.length > 0 && (
              <Button size="sm" className="gap-2 bg-accent text-accent-foreground" onClick={handlePrint}>
                <Printer className="h-4 w-4" /> Print Sheet
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 pb-24 overflow-x-hidden w-full max-w-full print:p-0">
          <Card className="border-none shadow-lg w-full print:hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-md flex items-center gap-2">
                <Ruler className="h-4 w-4 text-accent" /> Order Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-6">
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formType} onValueChange={(v: any) => setFormType(v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sliding">Sliding</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Colour</Label>
                  <Select value={formColourId} onValueChange={setFormColourId}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockColours.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Width (ft)</Label>
                  <Input type="number" className="h-11" step="0.01" value={formWidth} onChange={e => setFormWidth(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Height (ft)</Label>
                  <Input type="number" className="h-11" step="0.01" value={formHeight} onChange={e => setFormHeight(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" className="h-11" value={formQty} onChange={e => setFormQty(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Glass Type</Label>
                  <Select value={formGlassType} onValueChange={setFormGlassType}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGlassTypes.map(g => (
                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-accent/5 border border-dashed border-accent/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-accent" />
                  <span className="text-sm font-bold">Manual Hardware Cost</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cost per window (PKR)</Label>
                  <Input 
                    type="number" 
                    className="h-11"
                    value={manualHardwareCost} 
                    onChange={e => setManualHardwareCost(e.target.value)} 
                    placeholder="Enter manual hardware amount..." 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <Button onClick={addItem} className="w-full h-12 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-5 w-5" /> Add Window & Calculate
              </Button>
            </CardFooter>
          </Card>

          {items.length > 0 && (
            <div className="space-y-6">
              {/* Printable Table with Drawings */}
              <div className="print:block">
                <h3 className="text-lg font-bold mb-4 hidden print:block">Order Specification Table</h3>
                {items.map((item, idx) => {
                  const activeComparisons = calculateAllSections(item.width, item.height, item.quantity, selectedColour, item.hardwareCost / item.quantity, item.type)
                  
                  return (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 border p-4 rounded-lg bg-card shadow-sm mb-6 break-inside-avoid">
                      <div className="md:col-span-1 flex items-center justify-center font-black text-2xl text-accent/20">
                        {idx + 1}
                      </div>
                      <div className="md:col-span-3 flex justify-center">
                        <WindowDrawing width={item.width} height={item.height} type={item.type} />
                      </div>
                      <div className="md:col-span-5 space-y-4">
                        <div>
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Specification</Label>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-1">
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-xs">Width</span>
                              <span className="text-xs font-bold">{item.width} ft</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-xs">Height</span>
                              <span className="text-xs font-bold">{item.height} ft</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-xs">Quantity</span>
                              <span className="text-xs font-bold">{item.quantity} units</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-xs">Colour</span>
                              <span className="text-xs font-bold">{item.colour}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">Cutting Details (Per Unit)</Label>
                          <div className="space-y-2 mt-2">
                             {activeComparisons.map((comp, cidx) => (
                               <div key={cidx} className="bg-muted/30 p-2 rounded text-[11px] border border-border/50">
                                 <p className="font-bold text-accent mb-1 underline">{comp.sectionName}</p>
                                 <div className="grid grid-cols-3 gap-2">
                                   <span>Top: <b>{comp.topFt} ft</b></span>
                                   <span>Bottom: <b>{comp.bottomFt} ft</b></span>
                                   <span>Sides (x2): <b>{comp.sideFt} ft</b></span>
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-3 flex flex-col justify-end items-end space-y-2 print:hidden">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-black">Estimated Bill</p>
                          <p className="text-xl font-black text-accent">PKR {item.totalCost.toLocaleString()}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => setItems(items.filter(i => i.id !== item.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 w-full print:mt-12">
               <Card className="border-none shadow-lg bg-accent/5 break-inside-avoid">
                  <CardHeader className="p-4">
                    <CardTitle className="text-md">Bill Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Frame Cost</span>
                        <span className="font-medium">PKR {items.reduce((s, i) => s + i.frameCost, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Glass Cost</span>
                        <span className="font-medium">PKR {items.reduce((s, i) => s + i.glassCost, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hardware</span>
                        <span className="font-medium">PKR {items.reduce((s, i) => s + i.hardwareCost, 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-between font-black text-lg border-t-2 border-dashed">
                      <span>TOTAL</span>
                      <span className="text-accent">PKR {grossAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
               </Card>

               <Card className="border-none shadow-lg break-inside-avoid print:bg-muted/10">
                  <CardHeader className="p-4">
                    <CardTitle className="text-md">Final Billing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0">
                    <div className="space-y-2 print:hidden">
                      <Label className="text-xs">Discount (%)</Label>
                      <Input 
                        type="number" 
                        className="h-11"
                        value={discountPercent} 
                        onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="bg-background p-4 rounded-lg border-2 border-accent/20">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-black">Net Payable</span>
                        {discountPercent > 0 && <span className="text-[10px] text-green-500 font-bold">-{discountPercent}% OFF</span>}
                      </div>
                      <p className="text-3xl font-black text-accent">PKR {netAmount.toLocaleString()}</p>
                    </div>
                  </CardContent>
               </Card>
            </div>
          )}

          <div className="hidden print:block mt-12 pt-8 border-t text-center text-[10px] text-muted-foreground">
            <p>Generated by Awan Aluminum Management System</p>
            <p>Industrial Precision & Cutting Optimization</p>
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t p-4 flex justify-between items-center z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] print:hidden">
          <div className="flex flex-col">
            <p className="text-[10px] text-muted-foreground font-bold">{items.length} Items</p>
            <p className="font-black text-accent text-xl leading-none">PKR {netAmount.toLocaleString()}</p>
          </div>
          <Button size="lg" className="h-12 px-8 font-black bg-accent text-accent-foreground rounded-full" onClick={handlePrint}>
            PRINT ORDER
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
