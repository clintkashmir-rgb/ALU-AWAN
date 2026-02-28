"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Save, CheckCircle, Ruler, AlertTriangle } from "lucide-react"
import { Section } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { collection, serverTimestamp } from "firebase/firestore"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { useRouter } from "next/navigation"
import { WindowDrawing } from "@/components/WindowDrawing"

export default function NewOrderPage() {
  const { toast } = useToast()
  const firestore = useFirestore()
  const router = useRouter()
  
  const [customerName, setCustomerName] = React.useState("")
  const [width, setWidth] = React.useState("4")
  const [height, setHeight] = React.useState("4")
  const [qty, setQty] = React.useState("1")
  const [glassRate, setGlassRate] = React.useState("120")
  const [windowType, setWindowType] = React.useState<'Sliding' | 'Fixed'>('Sliding')
  const [discountPercent, setDiscountPercent] = React.useState(0)
  const [showResults, setShowResults] = React.useState(false)

  const sectionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "sections");
  }, [firestore]);
  
  const { data: allSections } = useCollection<Section>(sectionsQuery);

  // Strict Filter: Only show sections that have an active formula
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

  const glassAmount = React.useMemo(() => {
    return Math.round(glassSqFt * (parseFloat(glassRate) || 0))
  }, [glassSqFt, glassRate])

  const evaluateFormula = (formula: string | undefined, w: number, h: number): number => {
    try {
      if (!formula || formula === 'None') return 0
      const parts = formula.split(/\s+/) // Robust split by any whitespace
      if (parts.length < 3) return 0
      
      const variableValue = parts[0] === 'Width' ? w : parts[0] === 'Height' ? h : 0
      const op = parts[1]
      const val = parseFloat(parts[2]) || 0
      
      let result = 0
      if (op === '+') result = variableValue + val
      else if (op === '-') result = variableValue - val
      else if (op === '*') result = variableValue * val
      else if (op === '/') result = val !== 0 ? variableValue / val : 0
      
      return isNaN(result) ? 0 : result
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
      
      // Standard frame logic: Top + Bottom + 2 Sides
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
  }, [width, height, qty, configuredSections, showResults])

  // Calculation based on first available profile for grand total reference
  const grandTotal = Math.round((glassAmount + (comparisonData[0]?.amount || 0)) * (1 - discountPercent / 100))

  const handleCalculate = () => {
    if (!width || !height || !qty) {
      toast({ variant: "destructive", title: "Inputs Required", description: "Enter Width, Height and Qty." })
      return
    }
    
    if (configuredSections.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "No Formulas Found", 
        description: "Please go to Formula Builder and add logic first." 
      })
      return
    }
    
    setShowResults(true)
  }

  const handleSaveOrder = () => {
    if (!customerName) {
      toast({ variant: "destructive", title: "Missing Info", description: "Enter Customer Name." })
      return
    }

    if (!firestore) return;
    
    const orderData = {
      customerName,
      date: new Date().toLocaleDateString(),
      width: parseFloat(width),
      height: parseFloat(height),
      qty: parseInt(qty),
      type: windowType,
      glassSqFt,
      glassAmount,
      netAmount: grandTotal,
      status: "Paid",
      timestamp: serverTimestamp()
    };

    addDocumentNonBlocking(collection(firestore, "invoices"), orderData);
    
    toast({ title: "Order Saved Online", description: "Data synced to your Dashboard." });
    router.push("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="font-headline text-xl font-bold uppercase tracking-tight">New Order</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
          <Card className="border-none shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <Ruler className="h-4 w-4 text-accent" /> 1. Dimensions Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Customer Name</Label>
                  <Input placeholder="Enter Name..." className="h-12 text-lg" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Type</Label>
                  <Select value={windowType} onValueChange={(v: any) => { setWindowType(v); setShowResults(false); }}>
                    <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sliding">Sliding Window</SelectItem>
                      <SelectItem value="Fixed">Fixed Window</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Width (ft)</Label>
                  <Input type="number" step="any" className="h-12 text-lg text-center font-bold" value={width} onChange={e => { setWidth(e.target.value); setShowResults(false); }} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Height (ft)</Label>
                  <Input type="number" step="any" className="h-12 text-lg text-center font-bold" value={height} onChange={e => { setHeight(e.target.value); setShowResults(false); }} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Quantity (N)</Label>
                  <Input type="number" className="h-12 text-lg text-center font-bold" value={qty} onChange={e => { setQty(e.target.value); setShowResults(false); }} />
                </div>
              </div>

              {configuredSections.length === 0 && (
                <div className="p-4 bg-destructive/10 border-2 border-dashed border-destructive/30 rounded-xl flex flex-col items-center justify-center gap-3 text-destructive animate-pulse">
                  <AlertTriangle className="h-8 w-8" />
                  <p className="text-sm font-black uppercase text-center">
                    Attention: No formulas added!<br/>
                    <span className="text-[10px] opacity-70">Please add logic in Inventory &gt; Formulas first.</span>
                  </p>
                </div>
              )}

              <Button 
                onClick={handleCalculate} 
                className="w-full h-14 text-lg font-black bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg rounded-xl gap-2 mt-4"
                disabled={configuredSections.length === 0}
              >
                <CheckCircle className="h-6 w-6" /> OK - CALCULATE
              </Button>
            </CardContent>
          </Card>

          {showResults && configuredSections.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg bg-white overflow-hidden p-6 flex items-center justify-center">
                  <WindowDrawing width={parseFloat(width)} height={parseFloat(height)} type={windowType} />
                </Card>

                <Card className="md:col-span-2 border-none shadow-lg bg-accent/5 border-2 border-dashed border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-2">
                      <Calculator className="h-4 w-4" /> Glass Calculation Box
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-background rounded-lg border">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Calculation: W &times; H &times; Q = Total Sqft</span>
                      <span className="text-xl font-black text-accent">{width} &times; {height} &times; {qty} = {glassSqFt} Sqft</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Glass Rate (PKR/Sqft)</Label>
                        <Input type="number" className="h-12 text-xl font-black" value={glassRate} onChange={e => setGlassRate(e.target.value)} />
                      </div>
                      <div className="text-right space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Glass Total</Label>
                        <div className="text-3xl font-black text-accent">PKR {glassAmount.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Section Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">Profile</TableHead>
                        <TableHead className="text-right font-bold">Total Ft</TableHead>
                        <TableHead className="text-right font-bold">Rate (/ft)</TableHead>
                        <TableHead className="text-right font-bold">Amount (PKR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.map(s => (
                        <TableRow key={s.id} className="hover:bg-muted/10 transition-colors">
                          <TableCell className="font-black text-accent">{s.name}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{s.totalFt} ft</TableCell>
                          <TableCell className="text-right text-xs opacity-70">PKR {s.rate}</TableCell>
                          <TableCell className="text-right font-black text-xl">PKR {s.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row items-end justify-between bg-card p-6 rounded-2xl shadow-2xl border gap-6">
                <div className="w-full md:w-48 space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest">Discount (%)</Label>
                  <Input type="number" value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} className="h-12 text-xl font-bold" />
                </div>
                <div className="text-right space-y-1 flex-1">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Grand Total</p>
                  <h2 className="text-5xl font-black text-accent">PKR {grandTotal.toLocaleString()}</h2>
                </div>
                <Button 
                  onClick={handleSaveOrder} 
                  className="h-16 px-12 bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-black rounded-xl shadow-xl gap-3"
                >
                  <Save className="h-6 w-6" /> SAVE ORDER
                </Button>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
