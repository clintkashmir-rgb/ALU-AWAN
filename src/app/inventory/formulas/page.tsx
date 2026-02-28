"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Save, RefreshCcw, Plus, Minus, X, Divide, LayoutGrid, Info } from "lucide-react"
import { mockSections } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function FormulasPage() {
  const { toast } = useToast()
  const [selectedSectionId, setSelectedSectionId] = React.useState(mockSections[0].id)
  const [activeType, setActiveType] = React.useState<'Sliding' | 'Fixed'>('Sliding')
  
  // Formula State
  const [topFormula, setTopFormula] = React.useState({ variable: "Width", operator: "-", constant: "0" })
  const [bottomFormula, setBottomFormula] = React.useState({ variable: "Width", operator: "-", constant: "0" })
  const [sideFormula, setSideFormula] = React.useState({ variable: "Height", operator: "-", constant: "0" })

  const handleSave = () => {
    toast({ 
      title: "Logic Updated", 
      description: `Formula for ${mockSections.find(s => s.id === selectedSectionId)?.name} saved successfully.` 
    })
  }

  const evaluateFormula = (state: any) => {
    const val = state.constant === "" ? 0 : parseFloat(state.constant)
    if (state.operator === "*" && val === 0) return 0
    return 1 // Placeholder for non-zero logic
  }

  const FormulaRow = ({ label, state, setState }: any) => {
    const isZero = (state.operator === "*" && state.constant === "0") || (state.variable === "None")
    
    return (
      <div className={`space-y-3 p-4 border rounded-lg transition-colors ${isZero ? 'bg-muted/30 opacity-60' : 'bg-card'}`}>
        <div className="flex justify-between items-center">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground">{label}</Label>
          {isZero && <Badge variant="outline" className="text-[8px]">Excluded</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={state.variable} onValueChange={(v) => setState({ ...state, variable: v })}>
            <SelectTrigger className="w-[110px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Width">Width</SelectItem>
              <SelectItem value="Height">Height</SelectItem>
              <SelectItem value="None">None</SelectItem>
            </SelectContent>
          </Select>

          <Select value={state.operator} onValueChange={(v) => setState({ ...state, operator: v })}>
            <SelectTrigger className="w-[70px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+">+</SelectItem>
              <SelectItem value="-">-</SelectItem>
              <SelectItem value="*">×</SelectItem>
              <SelectItem value="/">÷</SelectItem>
            </SelectContent>
          </Select>

          <Input 
            type="number" 
            className="w-[90px] h-9" 
            value={state.constant} 
            onChange={(e) => setState({ ...state, constant: e.target.value })} 
            placeholder="0"
          />

          <div className="ml-auto px-3 py-1.5 bg-accent/5 border border-accent/10 rounded font-mono text-xs text-accent">
            {isZero ? "Skip" : `${state.variable} ${state.operator} ${state.constant || 0}`}
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" /> Section Formulas
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Logic Builder</CardTitle>
                  <CardDescription>Define how parts are cut for this specific profile.</CardDescription>
                </div>
                <Tabs value={activeType} onValueChange={(v: any) => setActiveType(v)}>
                  <TabsList>
                    <TabsTrigger value="Sliding">Sliding</TabsTrigger>
                    <TabsTrigger value="Fixed">Fixed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Select Aluminum Profile</Label>
                <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSections.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                <FormulaRow label="Top Frame (Chat)" state={topFormula} setState={setTopFormula} />
                <FormulaRow label="Bottom Frame (Dehliz)" state={bottomFormula} setState={setBottomFormula} />
                <FormulaRow label="Side Frame (Side)" state={sideFormula} setState={setSideFormula} />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg flex gap-3 items-start">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Tip:</strong> To exclude a component (like a section that only goes at the bottom), set its operator to <strong>*</strong> and constant to <strong>0</strong>, or select <strong>None</strong> for the variable.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
              <Button variant="ghost" size="sm" className="gap-2">
                <RefreshCcw className="h-3 w-3" /> Reset
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                <Save className="h-4 w-4" /> Save Configuration
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-lg bg-accent/5">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" /> Current Logic Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Top</p>
                    <p className="text-sm font-mono">{(topFormula.operator === "*" && topFormula.constant === "0") ? "---" : `${topFormula.variable}${topFormula.operator}${topFormula.constant}`}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Bottom</p>
                    <p className="text-sm font-mono">{(bottomFormula.operator === "*" && bottomFormula.constant === "0") ? "---" : `${bottomFormula.variable}${bottomFormula.operator}${bottomFormula.constant}`}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Sides (x2)</p>
                    <p className="text-sm font-mono">{(sideFormula.operator === "*" && sideFormula.constant === "0") ? "---" : `${sideFormula.variable}${sideFormula.operator}${sideFormula.constant}`}</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
