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
import { Plus, Trash2, Save, Calculator, ReceiptText } from "lucide-react"
import { WindowItem, HardwareItem } from "@/lib/types"
import { mockSections, mockColours, mockGlassTypes, mockHardware } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function NewOrderPage() {
  const { toast } = useToast()
  const [items, setItems] = React.useState<WindowItem[]>([])
  const [customerName, setCustomerName] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  
  // Form State
  const [formType, setFormType] = React.useState<'Fixed' | 'Sliding'>('Sliding')
  const [formPalla, setFormPalla] = React.useState('2')
  const [formColour, setFormColour] = React.useState(mockColours[0].name)
  const [formGlassType, setFormGlassType] = React.useState(mockGlassTypes[0].id)
  const [formWidth, setFormWidth] = React.useState("")
  const [formHeight, setFormHeight] = React.useState("")
  const [formQty, setFormQty] = React.useState("1")
  const [formSection, setFormSection] = React.useState(mockSections[0].id)
  const [selectedHardware, setSelectedHardware] = React.useState<string[]>([])

  const toggleHardware = (id: string) => {
    setSelectedHardware(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    )
  }

  const addItem = () => {
    if (!formWidth || !formHeight) {
      toast({ variant: "destructive", title: "Validation Error", description: "Width and Height are required." })
      return
    }

    const w = parseFloat(formWidth)
    const h = parseFloat(formHeight)
    const q = parseInt(formQty)
    const sectionObj = mockSections.find(s => s.id === formSection)
    const glassObj = mockGlassTypes.find(g => g.id === formGlassType)
    
    const frameRate = sectionObj?.rate_per_ft || 220
    const glassRate = glassObj?.rate_per_sqft || 120

    // Frame Deduction Logic (0.1 ft per side)
    const frameSide = 0.1
    const frameTop = 0.1
    const frameBottom = 0.1

    // Glass Dimensions
    const glassWidth = w - (2 * frameSide)
    const glassHeight = h - (frameTop + frameBottom)
    const glassSqFtPerWindow = glassWidth * glassHeight
    const totalGlassArea = glassSqFtPerWindow * q

    // Frame Calculation
    const frameFtPerWindow = (2 * w) + (2 * h)
    const totalFrameFt = frameFtPerWindow * q

    // Hardware Calculation
    const hardwareCostPerWindow = selectedHardware.reduce((acc, hid) => {
      const hw = mockHardware.find(h => h.id === hid)
      return acc + (hw?.rate || 0)
    }, 0)
    const totalHardwareCost = hardwareCostPerWindow * q

    const frameCost = totalFrameFt * frameRate
    const glassCost = totalGlassArea * glassRate

    const newItem: WindowItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: formType,
      pallaQty: parseInt(formPalla),
      colour: formColour,
      glassType: glassObj?.name || 'Standard',
      width: w,
      height: h,
      quantity: q,
      frameFt: totalFrameFt,
      glassSqFt: parseFloat(totalGlassArea.toFixed(2)),
      frameCost: Math.round(frameCost),
      glassCost: Math.round(glassCost),
      hardwareCost: totalHardwareCost,
      totalCost: Math.round(frameCost + glassCost + totalHardwareCost)
    }

    setItems([...items, newItem])
    setFormWidth("")
    setFormHeight("")
    setSelectedHardware([])
    toast({ title: "Item Added", description: "Window specifications added successfully." })
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const grossAmount = items.reduce((sum, item) => sum + item.totalCost, 0)
  const netAmount = Math.max(0, grossAmount - discount)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden max-w-full">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 w-full">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold truncate">Create New Order</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 pb-32 md:pb-6 overflow-x-hidden w-full max-w-full">
          <Card className="border-none shadow-lg w-full">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 p-4 md:p-6 pt-0">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input 
                  className="h-11"
                  placeholder="Full Name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Order Date</Label>
                <Input className="h-11" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg w-full">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Window Specifications (ft)</CardTitle>
              <CardDescription>Enter measurements in Feet (ft)</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-6">
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                  <Label>Section Profile</Label>
                  <Select value={formSection} onValueChange={setFormSection}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSections.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.rate_per_ft}/ft)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Hardware</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mockHardware.map((hw) => (
                    <div key={hw.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-card/50">
                      <Checkbox 
                        id={hw.id} 
                        checked={selectedHardware.includes(hw.id)}
                        onCheckedChange={() => toggleHardware(hw.id)}
                      />
                      <Label htmlFor={hw.id} className="cursor-pointer">
                        <span className="block font-medium">{hw.name}</span>
                        <span className="text-[10px] text-muted-foreground">PKR {hw.rate}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button onClick={addItem} className="w-full h-12 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4" /> Add Window to Table
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg w-full">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Order Breakdown (Auto Calculated)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full whitespace-nowrap">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead className="min-w-[150px]">Description</TableHead>
                      <TableHead className="text-right">Frame (ft)</TableHead>
                      <TableHead className="text-right">Glass (sqft)</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Amount (PKR)</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          No windows added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={item.id} className="text-sm">
                          <TableCell className="font-mono text-[10px]">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold">{item.type} Window</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{item.width}x{item.height} ft • {item.colour} • {item.glassType}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.frameFt}</TableCell>
                          <TableCell className="text-right">{item.glassSqFt}</TableCell>
                          <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                          <TableCell className="text-right font-bold text-accent">
                            {item.totalCost.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 w-full">
             <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/20">
                    <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground">
                      <span>Category</span>
                      <span>Total Amount</span>
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
                  <div className="pt-2 border-t flex justify-between font-black text-lg">
                    <span>GROSS TOTAL</span>
                    <span className="text-accent">PKR {grossAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-lg bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg">Billing & Checkout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Discount (PKR)</Label>
                    <Input 
                      type="number" 
                      className="h-11"
                      value={discount} 
                      onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0" 
                    />
                  </div>
                  <div className="bg-background p-5 rounded-xl border-2 border-accent/20 shadow-inner">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Net Payable Amount</span>
                      <span className="text-4xl font-black text-accent">PKR {netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-3">
                  <Button variant="outline" className="flex-1 h-12 gap-2">
                    <ReceiptText className="h-4 w-4" /> Quote
                  </Button>
                  <Button className="flex-1 h-12 gap-2 bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4" /> Save Order
                  </Button>
                </CardFooter>
             </Card>
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t p-4 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-30">
          <div className="flex flex-col">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{items.length} Window(s) Added</p>
            <p className="font-black text-accent text-xl leading-none">PKR {netAmount.toLocaleString()}</p>
          </div>
          <Button size="lg" className="h-12 px-6 gap-2 font-black shadow-lg shadow-accent/20 bg-accent text-accent-foreground rounded-full">
            <Save className="h-5 w-5" /> SAVE
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
