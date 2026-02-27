
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
import { Plus, Trash2, Save, Calculator, ReceiptText, Sparkles, Ruler } from "lucide-react"
import { WindowItem, Section } from "@/lib/types"
import { mockSections, mockColours, mockGlassTypes, mockHardware } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"

export default function NewOrderPage() {
  const { toast } = useToast()
  const [items, setItems] = React.useState<WindowItem[]>([])
  const [customerName, setCustomerName] = React.useState("")
  const [discountPercent, setDiscountPercent] = React.useState(0)
  
  // Form State (Section selection removed as per request)
  const [formType, setFormType] = React.useState<'Fixed' | 'Sliding'>('Sliding')
  const [formPalla, setFormPalla] = React.useState('2')
  const [formColour, setFormColour] = React.useState(mockColours[0].name)
  const [formGlassType, setFormGlassType] = React.useState(mockGlassTypes[0].id)
  const [formWidth, setFormWidth] = React.useState("")
  const [formHeight, setFormHeight] = React.useState("")
  const [formQty, setFormQty] = React.useState("1")
  const [selectedHardware, setSelectedHardware] = React.useState<string[]>([])

  const toggleHardware = (id: string) => {
    setSelectedHardware(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    )
  }

  // Calculate costs for all sections to provide a comparison
  const calculateAllSections = (w: number, h: number, q: number) => {
    return mockSections.map(section => {
      const frameRate = section.rate_per_ft || 220
      const glassObj = mockGlassTypes.find(g => g.id === formGlassType)
      const glassRate = glassObj?.rate_per_sqft || 120

      // Deduction logic (0.1 ft per side)
      const frameSide = 0.1
      const frameTop = 0.1
      const frameBottom = 0.1

      const glassWidth = w - (2 * frameSide)
      const glassHeight = h - (frameTop + frameBottom)
      const glassArea = Math.max(0, glassWidth * glassHeight) * q
      const frameFt = (2 * w + 2 * h) * q

      const hardwareCost = selectedHardware.reduce((acc, hid) => {
        const hw = mockHardware.find(h => h.id === hid)
        return acc + (hw?.rate || 0)
      }, 0) * q

      const frameCost = frameFt * frameRate
      const glassCost = glassArea * glassRate

      return {
        sectionName: section.name,
        sectionId: section.id,
        frameFt: parseFloat(frameFt.toFixed(2)),
        glassSqFt: parseFloat(glassArea.toFixed(2)),
        totalCost: Math.round(frameCost + glassCost + hardwareCost),
        frameCost: Math.round(frameCost),
        glassCost: Math.round(glassCost),
        hardwareCost
      }
    })
  }

  const addItem = () => {
    if (!formWidth || !formHeight) {
      toast({ variant: "destructive", title: "Validation Error", description: "Width and Height are required." })
      return
    }

    const w = parseFloat(formWidth)
    const h = parseFloat(formHeight)
    const q = parseInt(formQty)
    
    // Automatically use the first section as default for the main bill, 
    // but the UI will show comparison for all.
    const comparisons = calculateAllSections(w, h, q)
    const defaultCalc = comparisons[0]

    const newItem: WindowItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: formType,
      pallaQty: parseInt(formPalla),
      colour: formColour,
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
    toast({ title: "Item Added", description: "Window dimensions saved. Checking calculations..." })
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const grossAmount = items.reduce((sum, item) => sum + item.totalCost, 0)
  const discountAmount = grossAmount * (discountPercent / 100)
  const netAmount = Math.max(0, grossAmount - discountAmount)

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
            <Link href="/ai-tools">
              <Sparkles className="h-4 w-4" /> Formulas
            </Link>
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 pb-32 md:pb-6 overflow-x-hidden w-full max-w-full">
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
                  <Label>Palla</Label>
                  <Select value={formPalla} onValueChange={setFormPalla}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Palla</SelectItem>
                      <SelectItem value="3">3 Palla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Colour</Label>
                  <Select value={formColour} onValueChange={setFormColour}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockColours.map(c => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
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
                      <SelectValue placeholder="Select Glass" />
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

          {/* Automatic Section Comparison Table */}
          {items.length > 0 && (
            <Card className="border-none shadow-lg w-full bg-muted/20">
              <CardHeader className="p-4">
                <CardTitle className="text-sm">Automatic Bill Comparison (All Sections)</CardTitle>
                <CardDescription className="text-xs">Costs calculated automatically based on input dimensions.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full whitespace-nowrap">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Section Profile</TableHead>
                        <TableHead className="text-right">Frame (ft)</TableHead>
                        <TableHead className="text-right">Glass (sqft)</TableHead>
                        <TableHead className="text-right font-bold text-accent">Total (PKR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => {
                        const comparisons = calculateAllSections(item.width, item.height, item.quantity)
                        return comparisons.map((comp, idx) => (
                          <TableRow key={`${item.id}-${idx}`} className="text-xs">
                            <TableCell className="font-bold">{comp.sectionName}</TableCell>
                            <TableCell className="text-right">{comp.frameFt}</TableCell>
                            <TableCell className="text-right">{comp.glassSqFt}</TableCell>
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

          {/* Order Final Breakdown */}
          <div className="grid gap-6 md:grid-cols-2 w-full">
             <Card className="border-none shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="text-md">Bill Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/10">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground border-b pb-1">
                      <span>Item</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Aluminum Frames</span>
                      <span className="font-medium">PKR {items.reduce((s, i) => s + i.frameCost, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Glass Work</span>
                      <span className="font-medium">PKR {items.reduce((s, i) => s + i.glassCost, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hardware & Fittings</span>
                      <span className="font-medium">PKR {items.reduce((s, i) => s + i.hardwareCost, 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between font-black text-lg border-t-2 border-dashed">
                    <span>TOTAL</span>
                    <span className="text-accent">PKR {grossAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-lg bg-accent/5">
                <CardHeader className="p-4">
                  <CardTitle className="text-md">Billing</CardTitle>
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
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-black">Net Payable</span>
                      <span className="text-3xl font-black text-accent">PKR {netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 gap-2">
                  <Button variant="outline" className="flex-1 h-12">Quote</Button>
                  <Button className="flex-1 h-12 bg-primary">Save Order</Button>
                </CardFooter>
             </Card>
          </div>
        </main>

        {/* Mobile Sticky Action */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t p-4 flex justify-between items-center z-30 shadow-2xl">
          <div className="flex flex-col">
            <p className="text-[10px] text-muted-foreground font-bold tracking-tighter">{items.length} Items Calculated</p>
            <p className="font-black text-accent text-xl leading-none">PKR {netAmount.toLocaleString()}</p>
          </div>
          <Button size="lg" className="h-12 px-6 font-black bg-accent text-accent-foreground rounded-full shadow-lg">
            <Save className="h-5 w-5 mr-2" /> SAVE
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
