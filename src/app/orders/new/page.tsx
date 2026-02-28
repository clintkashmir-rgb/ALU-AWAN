
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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Save, Calculator, Sparkles, Ruler } from "lucide-react"
import { WindowItem, Section, Colour } from "@/lib/types"
import { mockSections, mockColours, mockGlassTypes, mockHardware } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"

export default function NewOrderPage() {
  const { toast } = useToast()
  const [items, setItems] = React.useState<WindowItem[]>([])
  const [discountPercent, setDiscountPercent] = React.useState(0)
  
  // Form State
  const [formType, setFormType] = React.useState<'Fixed' | 'Sliding'>('Sliding')
  const [formPalla, setFormPalla] = React.useState('2')
  const [formColourId, setFormColourId] = React.useState(mockColours[0].id)
  const [formGlassType, setFormGlassType] = React.useState(mockGlassTypes[0].id)
  const [formWidth, setFormWidth] = React.useState("")
  const [formHeight, setFormHeight] = React.useState("")
  const [formQty, setFormQty] = React.useState("1")
  const [selectedHardware, setSelectedHardware] = React.useState<string[]>([])

  const selectedColour = mockColours.find(c => c.id === formColourId) || mockColours[0]

  const toggleHardware = (id: string) => {
    setSelectedHardware(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    )
  }

  // Evaluate dynamic formula string
  const evaluate = (formula: string, w: number, h: number): number => {
    try {
      const parts = formula.split(' ');
      if (parts.length < 3) return 0;
      
      const variableName = parts[0];
      const variable = variableName === 'Width' ? w : variableName === 'Height' ? h : 0;
      
      // If variable is None, formula is invalid/skipped
      if (variableName === 'None') return 0;

      const operator = parts[1];
      const constant = parseFloat(parts[2]);

      if (operator === '+') return variable + constant;
      if (operator === '-') return variable - constant;
      if (operator === '*') return variable * constant;
      if (operator === '/') return constant !== 0 ? variable / constant : 0;
      return 0;
    } catch {
      return 0;
    }
  }

  const calculateAllSections = (w: number, h: number, q: number, colour: Colour) => {
    return mockSections
      .map(section => {
        // Pick rate based on selected color category
        let frameRate = 220;
        if (section.rates && colour.category) {
          frameRate = section.rates[colour.category] || 220;
        } else if (section.rate_per_ft) {
          frameRate = section.rate_per_ft;
        }

        const glassObj = mockGlassTypes.find(g => g.id === formGlassType)
        const glassRate = glassObj?.rate_per_sqft || 120

        // Frame deductions (0.1 ft per side = 0.2 ft total)
        const deduction = 0.1
        
        const topFt = evaluate(section.top_formula, w, h);
        const bottomFt = evaluate(section.bottom_formula, w, h);
        const sideFt = evaluate(section.side_formula, w, h);

        // Total frame for 1 window = top + bottom + (2 * side)
        const frameFtPerWindow = (topFt > 0 ? topFt : 0) + (bottomFt > 0 ? bottomFt : 0) + (2 * (sideFt > 0 ? sideFt : 0));
        const totalFrameFt = frameFtPerWindow * q;

        // Glass Area = (Width - 0.2) * (Height - 0.2)
        const glassArea = Math.max(0, (w - (2 * deduction)) * (h - (2 * deduction))) * q

        const hardwareCost = selectedHardware.reduce((acc, hid) => {
          const hw = mockHardware.find(h => h.id === hid)
          return acc + (hw?.rate || 0)
        }, 0) * q

        const frameCost = totalFrameFt * frameRate
        const glassCost = glassArea * glassRate

        return {
          sectionName: section.name,
          sectionId: section.id,
          frameFt: parseFloat(totalFrameFt.toFixed(2)),
          glassSqFt: parseFloat(glassArea.toFixed(2)),
          totalCost: Math.round(frameCost + glassCost + hardwareCost),
          frameCost: Math.round(frameCost),
          glassCost: Math.round(glassCost),
          hardwareCost,
          rateApplied: frameRate
        }
      })
      .filter(calc => calc.frameFt > 0); // CRITICAL: Only show sections where formulas are applied
  }

  const addItem = () => {
    if (!formWidth || !formHeight) {
      toast({ variant: "destructive", title: "Error", description: "Width and Height are required." })
      return
    }

    const w = parseFloat(formWidth)
    const h = parseFloat(formHeight)
    const q = parseInt(formQty)
    
    const comparisons = calculateAllSections(w, h, q, selectedColour)
    
    if (comparisons.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "No Formula Found", 
        description: "No sections have formulas configured for these dimensions." 
      })
      return
    }

    const defaultCalc = comparisons[0]

    const newItem: WindowItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: formType,
      pallaQty: parseInt(formPalla),
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
    setSelectedHardware([])
    toast({ title: "Calculated", description: "Bill generated based on active profile formulas." })
  }

  const grossAmount = items.reduce((sum, item) => sum + item.totalCost, 0)
  const netAmount = Math.max(0, grossAmount * (1 - discountPercent / 100))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden max-w-full">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="font-headline text-xl font-bold truncate">New Order</h1>
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-accent text-accent" asChild>
            <Link href="/inventory/formulas">
              <Sparkles className="h-4 w-4" /> Formulas
            </Link>
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 pb-24 overflow-x-hidden w-full max-w-full">
          <Card className="border-none shadow-lg w-full">
            <CardHeader className="p-4">
              <CardTitle className="text-md flex items-center gap-2">
                <Ruler className="h-4 w-4 text-accent" /> Dimensions & Specs
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
                      <SelectItem value="Fixed">Fixed</SelectItem>
                      <SelectItem value="Sliding">Sliding</SelectItem>
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
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Glass & Hardware</Label>
                <div className="grid gap-4 md:grid-cols-2">
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
                  <div className="flex flex-wrap gap-2">
                    {mockHardware.map((hw) => (
                      <div key={hw.id} className="flex items-center space-x-2 p-2 rounded-md border bg-card/50">
                        <Checkbox 
                          id={hw.id} 
                          checked={selectedHardware.includes(hw.id)}
                          onCheckedChange={() => toggleHardware(hw.id)}
                        />
                        <Label htmlFor={hw.id} className="text-xs cursor-pointer">{hw.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <Button onClick={addItem} className="w-full h-12 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-5 w-5" /> Calculate Bill
              </Button>
            </CardFooter>
          </Card>

          {items.length > 0 && (
            <Card className="border-none shadow-lg w-full bg-muted/20">
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Active Section Comparison</CardTitle>
                <CardDescription className="text-xs">Only showing sections with configured formulas for {selectedColour.name}.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full whitespace-nowrap">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Profile</TableHead>
                        <TableHead className="text-right">Rate (/ft)</TableHead>
                        <TableHead className="text-right">Total Frame (ft)</TableHead>
                        <TableHead className="text-right font-bold text-accent">Total Bill (PKR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => {
                        const activeComparisons = calculateAllSections(item.width, item.height, item.quantity, selectedColour)
                        return activeComparisons.map((comp, idx) => (
                          <TableRow key={`${item.id}-${idx}`} className="text-xs">
                            <TableCell className="font-bold">{comp.sectionName}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{comp.rateApplied}</TableCell>
                            <TableCell className="text-right">{comp.frameFt}</TableCell>
                            <TableCell className="text-right font-black text-accent">{comp.totalCost.toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      })}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 w-full">
             <Card className="border-none shadow-lg bg-accent/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-md">Bill Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground border-b pb-1">
                      <span>Category</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Aluminum Cost</span>
                      <span className="font-medium">PKR {items.reduce((s, i) => s + i.frameCost, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Glass Cost</span>
                      <span className="font-medium">PKR {items.reduce((s, i) => s + i.glassCost, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hardware Cost</span>
                      <span className="font-medium">PKR {items.reduce((s, i) => s + i.hardwareCost, 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between font-black text-lg border-t-2 border-dashed">
                    <span>TOTAL</span>
                    <span className="text-accent">PKR {grossAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="text-md">Final Billing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                  <div className="space-y-2">
                    <Label className="text-xs">Discount (%)</Label>
                    <Input 
                      type="number" 
                      className="h-11"
                      value={discountPercent} 
                      onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="bg-background p-4 rounded-lg border-2 border-accent/20">
                    <span className="text-[10px] text-muted-foreground uppercase font-black">Net Payable</span>
                    <p className="text-3xl font-black text-accent">PKR {netAmount.toLocaleString()}</p>
                  </div>
                </CardContent>
             </Card>
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t p-4 flex justify-between items-center z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col">
            <p className="text-[10px] text-muted-foreground font-bold">{items.length} Items</p>
            <p className="font-black text-accent text-xl leading-none">PKR {netAmount.toLocaleString()}</p>
          </div>
          <Button size="lg" className="h-12 px-8 font-black bg-accent text-accent-foreground rounded-full">
            SAVE ORDER
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
