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
      toast({ title: "Validation Error", description: "Width and Height are required." })
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
    toast({ title: "Item Added", description: "Window row added to calculation table." })
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const totalSqFt = items.reduce((sum, item) => sum + item.sqFt, 0)
  
  // Calculate Aluminum weight based on mock logic: Total Length = (W*2 + H*2) * Qty
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
  const netAmount = grossAmount - discount

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">New Window Order</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 pb-24 md:pb-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input 
                  id="customer" 
                  placeholder="Enter full name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Window Entry Form</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Window Type</Label>
                  <Select value={formType} onValueChange={(v: any) => setFormType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                      <SelectItem value="Sliding">Sliding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Palla Qty</Label>
                  <Select value={formPalla} onValueChange={setFormPalla}>
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                  <Label>Thickness</Label>
                  <Select value={formThickness} onValueChange={setFormThickness}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockThickness.map(t => (
                        <SelectItem key={t.id} value={t.value}>{t.value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Width (ft)</Label>
                  <Input type="number" step="0.01" value={formWidth} onChange={e => setFormWidth(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Height (ft)</Label>
                  <Input type="number" step="0.01" value={formHeight} onChange={e => setFormHeight(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" value={formQty} onChange={e => setFormQty(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button onClick={addItem} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4" /> Add to Order
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader>
              <CardTitle>Calculation Table</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Specs</TableHead>
                      <TableHead className="text-right">Width</TableHead>
                      <TableHead className="text-right">Height</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Sq.Ft</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          No items added yet. Use the form above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-center text-xs font-mono">{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.section}</TableCell>
                          <TableCell className="text-xs">
                            {item.colour} | {item.thickness} | {item.type} ({item.pallaQty}P)
                          </TableCell>
                          <TableCell className="text-right">{item.width}</TableCell>
                          <TableCell className="text-right">{item.height}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right font-bold text-accent">{item.sqFt}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
             <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aluminum Cost ({totalWeight.toFixed(2)}kg)</span>
                    <span className="font-medium">PKR {aluminumCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Glass Cost ({totalSqFt.toFixed(2)}sqft)</span>
                    <span className="font-medium">PKR {glassCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hardware Cost ({items.length} windows)</span>
                    <span className="font-medium">PKR {hardwareCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Labour Cost</span>
                    <span className="font-medium">PKR {labourCost.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between font-bold">
                    <span>Gross Amount</span>
                    <span className="text-accent">PKR {grossAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Final Bill Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (PKR)</Label>
                    <Input 
                      id="discount" 
                      type="number" 
                      value={discount} 
                      onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="Enter discount amount" 
                    />
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Net Payable</span>
                      <span className="text-3xl font-bold text-accent">PKR {netAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-4">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Calculator className="h-4 w-4" /> Quote
                  </Button>
                  <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4" /> Save & Generate
                  </Button>
                </CardFooter>
             </Card>
          </div>
        </main>

        {/* Mobile Sticky Footer */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t p-4 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-20">
          <div>
            <p className="text-xs text-muted-foreground">Total Sq.Ft: {totalSqFt.toFixed(1)}</p>
            <p className="font-bold text-accent">Net: PKR {netAmount.toLocaleString()}</p>
          </div>
          <Button size="sm" className="gap-2">
            <Save className="h-4 w-4" /> Save Order
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}