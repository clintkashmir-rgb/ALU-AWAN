
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
import { Calculator, Save, RefreshCcw, LayoutGrid, AlertTriangle, Trash2 } from "lucide-react"
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

    toast({ title: "Logic Reset", description: "Profile has been reset to default." });
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

        <main className="flex-1 p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
          {/* Logic Builder */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Logic Builder</CardTitle>
                  <CardDescription>Configure rules for selected profiles.</CardDescription>
                </div>
                <Tabs value={activeType} onValueChange={(v: any) => setActiveType(v)}>
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="Sliding">Sliding</TabsTrigger>
                    <TabsTrigger value="Fixed">Fixed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Select Profile to Configure</Label>
                <Select value={selectedSectionId || ""} onValueChange={setSelectedSectionId}>
                  <SelectTrigger className="h-12 text-base font-bold bg-muted/20">
                    <SelectValue placeholder={loading ? "Loading..." : "Select Profile"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map(s => (
                      <SelectItem key={s.id} value={s.id} className="font-medium">{s.name}</SelectItem>
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
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => {
                setTopFormula({ variable: "Width", operator: "+", constant: "0" })
                setBottomFormula({ variable: "Width", operator: "+", constant: "0" })
                setSideFormula({ variable: "Height", operator: "+", constant: "0" })
              }}>
                <RefreshCcw className="h-3 w-3" /> Reset UI
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8 font-bold shadow-lg">
                <Save className="h-4 w-4" /> SAVE LOGIC
              </Button>
            </CardFooter>
          </Card>

          {/* Active Profiles List (Now at Bottom) */}
          <Card className="border-none shadow-lg bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-accent" /> Active Profiles (Formulas Set)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-6">
                  {configuredSections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-40">
                      <AlertTriangle className="h-12 w-12 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-tight">No active formulas found.</p>
                      <p className="text-xs mt-1">Configure a profile above to activate it.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {configuredSections.map(s => (
                        <div key={s.id} className="p-4 bg-muted/20 rounded-xl border border-border/50 flex items-center justify-between group hover:bg-accent/5 hover:border-accent/20 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="font-black text-accent text-sm tracking-tight">{s.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => handleDeleteFormula(s.id)}
                            title="Reset Formula"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
