"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Save, RefreshCcw, LayoutGrid, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Section } from "@/lib/types"

export default function FormulasPage() {
  const { toast } = useToast()
  const firestore = useFirestore()
  
  const sectionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "sections");
  }, [firestore]);

  const { data: sections, isLoading: loading } = useCollection<Section>(sectionsQuery);
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null)
  const [activeType, setActiveType] = React.useState<'Sliding' | 'Fixed'>('Sliding')
  
  const currentSection = sections?.find(s => s.id === selectedSectionId)
  
  const [topFormula, setTopFormula] = React.useState({ variable: "Width", operator: "+", constant: "0" })
  const [bottomFormula, setBottomFormula] = React.useState({ variable: "Width", operator: "+", constant: "0" })
  const [sideFormula, setSideFormula] = React.useState({ variable: "Height", operator: "+", constant: "0" })

  React.useEffect(() => {
    if (sections && sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id)
    }
  }, [sections, selectedSectionId])

  React.useEffect(() => {
    if (currentSection) {
      const parseFormula = (f: string | undefined) => {
        if (!f || f === 'None') return { variable: "None", operator: "+", constant: "0" }
        const parts = f.split(/\s+/)
        if (parts.length < 3) return { variable: "None", operator: "+", constant: "0" }
        return { variable: parts[0], operator: parts[1], constant: parts[2] }
      }
      setTopFormula(parseFormula(currentSection.top_formula))
      setBottomFormula(parseFormula(currentSection.bottom_formula))
      setSideFormula(parseFormula(currentSection.side_formula))
    }
  }, [selectedSectionId, currentSection])

  const handleSave = () => {
    if (!firestore || !selectedSectionId || !currentSection) return;

    const formatStr = (state: any) => 
      state.variable === 'None' ? 'None' : `${state.variable} ${state.operator} ${state.constant || '0'}`

    const updatedData = {
      top_formula: formatStr(topFormula),
      bottom_formula: formatStr(bottomFormula),
      side_formula: formatStr(sideFormula),
      updatedAt: new Date().toISOString()
    }

    updateDocumentNonBlocking(doc(firestore, "sections", selectedSectionId), updatedData);
    
    toast({ 
      title: "Logic Saved", 
      description: `Formula updated for ${currentSection.name}.` 
    })
  }

  const handleDeleteFormula = (sectionId: string) => {
    if (!firestore) return;
    
    updateDocumentNonBlocking(doc(firestore, "sections", sectionId), {
      top_formula: "None",
      bottom_formula: "None",
      side_formula: "None",
      updatedAt: new Date().toISOString()
    });

    toast({ title: "Logic Deleted", description: "Formula has been reset to start." });
  }

  const FormulaRow = ({ label, state, setState }: any) => {
    const isExcluded = state.variable === "None"
    
    return (
      <div className={`space-y-3 p-4 border rounded-lg transition-all ${isExcluded ? 'bg-muted/30 opacity-50 grayscale' : 'bg-card shadow-sm'}`}>
        <div className="flex justify-between items-center">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground">{label}</Label>
          {isExcluded && <Badge variant="outline" className="text-[8px] bg-background">Excluded</Badge>}
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
            step="any"
            className="w-[90px] h-9" 
            value={state.constant} 
            onChange={(e) => setState({ ...state, constant: e.target.value })} 
            placeholder="0"
          />

          <div className="ml-auto px-3 py-1.5 bg-accent/5 border border-accent/10 rounded font-mono text-xs text-accent">
            {state.variable === 'None' ? '---' : 'ACTIVE'}
          </div>
        </div>
      </div>
    )
  }

  const configuredSections = sections?.filter(s => 
    (s.top_formula && s.top_formula !== 'None') || 
    (s.bottom_formula && s.bottom_formula !== 'None') || 
    (s.side_formula && s.side_formula !== 'None')
  ) || []

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
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border-none shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Logic Builder</CardTitle>
                    <CardDescription>Configure rules for selected profiles.</CardDescription>
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
                  <Label>Profile to Configure</Label>
                  <Select value={selectedSectionId || ""} onValueChange={setSelectedSectionId}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={loading ? "Loading..." : "Select Profile"} />
                    </SelectTrigger>
                    <SelectContent>
                      {sections?.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  <FormulaRow label="Top Frame" state={topFormula} setState={setTopFormula} />
                  <FormulaRow label="Bottom Frame" state={bottomFormula} setState={setBottomFormula} />
                  <FormulaRow label="Side Frames (x2)" state={sideFormula} setState={setSideFormula} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => {
                  setTopFormula({ variable: "Width", operator: "+", constant: "0" })
                  setBottomFormula({ variable: "Width", operator: "+", constant: "0" })
                  setSideFormula({ variable: "Height", operator: "+", constant: "0" })
                }}>
                  <RefreshCcw className="h-3 w-3" /> Reset UI
                </Button>
                <Button onClick={handleSave} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                  <Save className="h-4 w-4" /> Save Logic
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-accent" /> Active Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-3">
                    {configuredSections.length === 0 ? (
                      <div className="text-center py-8 opacity-40">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                        <p className="text-xs font-bold">No active formulas.</p>
                      </div>
                    ) : (
                      configuredSections.map(s => (
                        <div key={s.id} className="p-3 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-between group">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="font-bold text-accent text-xs">{s.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteFormula(s.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
