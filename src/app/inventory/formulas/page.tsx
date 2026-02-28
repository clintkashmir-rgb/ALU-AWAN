"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Save, RefreshCcw, Plus, Minus, X, Divide } from "lucide-react"
import { mockSections } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function FormulasPage() {
  const { toast } = useToast()
  const [selectedSectionId, setSelectedSectionId] = React.useState(mockSections[0].id)
  
  // Formula State for 3 components: Top, Bottom, Side
  const [topFormula, setTopFormula] = React.useState({ variable: "Width", operator: "-", constant: "0" })
  const [bottomFormula, setBottomFormula] = React.useState({ variable: "Width", operator: "-", constant: "0" })
  const [sideFormula, setSideFormula] = React.useState({ variable: "Height", operator: "-", constant: "0" })

  const handleSave = () => {
    toast({ 
      title: "Formulas Saved", 
      description: `Calculation logic for section updated successfully.` 
    })
  }

  const FormulaRow = ({ label, state, setState }: any) => (
    <div className="space-y-3 p-4 border rounded-lg bg-card/50">
      <Label className="text-xs font-bold uppercase text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={state.variable} onValueChange={(v) => setState({ ...state, variable: v })}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Width">Width</SelectItem>
            <SelectItem value="Height">Height</SelectItem>
          </SelectContent>
        </Select>

        <Select value={state.operator} onValueChange={(v) => setState({ ...state, operator: v })}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+"><Plus className="h-3 w-3" /></SelectItem>
            <SelectItem value="-"><Minus className="h-3 w-3" /></SelectItem>
            <SelectItem value="*"><X className="h-3 w-3" /></SelectItem>
            <SelectItem value="/"><Divide className="h-3 w-3" /></SelectItem>
          </SelectContent>
        </Select>

        <Input 
          type="number" 
          className="w-[100px]" 
          value={state.constant} 
          onChange={(e) => setState({ ...state, constant: e.target.value })} 
          placeholder="0.00"
        />

        <div className="px-3 py-2 bg-accent/10 border border-accent/20 rounded-md font-mono text-sm text-accent">
          Result = {state.variable} {state.operator} {state.constant}
        </div>
      </div>
    </div>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" /> Section Formula Builder
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Logic Configuration</CardTitle>
              <CardDescription>Select a section to define its component calculation rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Aluminum Section Profile</Label>
                <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSections.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                <FormulaRow label="Top Frame Formula" state={topFormula} setState={setTopFormula} />
                <FormulaRow label="Bottom Frame Formula" state={bottomFormula} setState={setBottomFormula} />
                <FormulaRow label="Side Frame Formula" state={sideFormula} setState={setSideFormula} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
              <Button variant="ghost" className="gap-2">
                <RefreshCcw className="h-4 w-4" /> Reset
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                <Save className="h-4 w-4" /> Save Formulas
              </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
