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
import { Plus, Trash2, Save, Calculator } from "lucide-react"
import { WindowItem } from "@/lib/types"
import { mockSections, mockColours, mockThickness, mockRates } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function NewOrderPage() {
  const { toast } = useToast()
  const [items, setItems] = React.useState<WindowItem[]>([])
  const [customerName, setCustomerName] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  
  // Form State
  const [formType, setFormType] = React.useState<'Fixed' | 'Sliding'>('Fixed')
  const [formPalla, setFormPalla] = React.useState('2')
  const [formColour, setFormColour] = React.useState(mockColours[0].name)
  const [formThickness, setFormThickness] = React.useState(mockThickness[0].value)
  const [formWidth, setFormWidth] = React.useState("")
  const [formHeight, setFormHeight] = React.useState("")
  const [formQty, setFormQty] = React.useState("1")
  const [formSection, setFormSection] = React.useState(mockSections[0].name)

  const addItem = () => {
    if (!formWidth || !formHeight) {
      toast({ variant: "destructive", title: "Validation Error", description: "Width and Height are required." })
      return
    }

    const w = parseFloat(formWidth)
    const h = parseFloat(formHeight)
    const q = parseInt(formQty)
    const sqFt = (w * h * q)

    const newItem: WindowItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: formType,
      pallaQty: parseInt(formPalla),
      colour: formColour,
      thickness: formThickness,
      width: w,
      height: h,
      quantity: q,
      sqFt: parseFloat(sqFt.toFixed(2)),
      section: formSection
    }

    setItems([...items, newItem])
    setFormWidth("")
    setFormHeight("")
    toast({ title: "Item Added", description: "Window row added to calculation table." })
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const totalSqFt = items.reduce((sum, item) => sum + item.sqFt, 0)
  
  const totalWeight = items.reduce((sum, item) => {
    const section = mockSections.find(s => s.name === item.section)
    const weightPerFt = section?.weight_per_ft || 0.4
    const totalLength = (item.width * 2 + item.height * 2) * item.quantity
    return sum + (totalLength * weightPerFt)
  }, 0)

  const aluminumCost = totalWeight * mockRates.aluminum_rate_per_kg
  const glassCost = totalSqFt * mockRates.glass_rate_per_sqft
  const hardwareCost = items.length * mockRates.hardware_rate
  const labourCost = totalSqFt * mockRates.labour_rate_per_sqft
  
  const grossAmount = aluminumCost + glassCost + hardwareCost + labourCost
  const netAmount = Math.max(0, grossAmount - discount)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">New Window Order</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 pb-28 md:pb-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 p-4 md:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input 
                  id="customer" 
                  className="h-11"
                  placeholder="Enter full name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Order Date</Label>
                <Input id="date" className="h-11" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Window Specification</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
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
                  <Label>Section</Label>
                  <Select value={formSection} onValueChange={setFormSection}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSections.map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
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
                <div className="space-y-2 col-span-2">
                  <Label>Quantity</Label>
                  <Input type="number" className="h-11" value={formQty} onChange={e => setFormQty(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button onClick={addItem} className="w-full md:w-auto h-11 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4" /> Add to Order
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Order Summary Table</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full whitespace-nowrap">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-10 text-center">#</TableHead>
                      <TableHead className="min-w-[120px]">Section</TableHead>
                      <TableHead className="min-w-[150px]">Specs</TableHead>
                      <TableHead className="text-right min-w-[80px]">Width</TableHead>
                      <TableHead className="text-right min-w-[80px]">Height</TableHead>
                      <TableHead className="text-right min-w-[60px]">Qty</TableHead>
                      <TableHead className="text-right min-w-[90px]">Sq.Ft</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          No items added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-center text-[10px] font-mono">{index + 1}</TableCell>
                          <TableCell className="font-medium text-sm">{item.section}</TableCell>
                          <TableCell className="text-[10px] text-muted-foreground uppercase">
                            {item.colour} • {item.thickness} • {item.pallaQty}P
                          </TableCell>
                          <TableCell className="text-right text-sm">{item.width}</TableCell>
                          <TableCell className="text-right text-sm">{item.height}</TableCell>
                          <TableCell className="text-right text-sm">{item.quantity}</TableCell>
                          <TableCell className="text-right font-bold text-accent text-sm">{item.sqFt}</TableCell>
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

          <div className="grid gap-6 md:grid-cols-2">
             <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase tracking-wider">Aluminum ({totalWeight.toFixed(2)}kg)</span>
                    <span className="font-medium">PKR {aluminumCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase tracking-wider">Glass ({totalSqFt.toFixed(2)}sqft)</span>
                    <span className="font-medium">PKR {glassCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase tracking-wider">Hardware ({items.length} units)</span>
                    <span className="font-medium">PKR {hardwareCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase tracking-wider">Labour</span>
                    <span className="font-medium">PKR {labourCost.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between font-bold text-sm">
                    <span className="uppercase">Gross Amount</span>
                    <span className="text-accent">PKR {grossAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-lg bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-lg">Final Bill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (PKR)</Label>
                    <Input 
                      id="discount" 
                      type="number" 
                      className="h-11"
                      value={discount} 
                      onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0" 
                    />
                  </div>
                  <div className="bg-background p-4 rounded-lg border border-accent/20">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Net Payable</span>
                      <span className="text-3xl font-black text-accent">PKR {netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-3">
                  <Button variant="outline" className="flex-1 h-12 gap-2">
                    <Calculator className="h-4 w-4" /> Quote
                  </Button>
                  <Button className="flex-1 h-12 gap-2 bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4" /> Save
                  </Button>
                </CardFooter>
             </Card>
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t p-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-30">
          <div className="flex flex-col">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">{totalSqFt.toFixed(1)} Sq.Ft Total</p>
            <p className="font-black text-accent text-lg">PKR {netAmount.toLocaleString()}</p>
          </div>
          <Button size="lg" className="h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/20">
            <Save className="h-5 w-5" /> SAVE
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
