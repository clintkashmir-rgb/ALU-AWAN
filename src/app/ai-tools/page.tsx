"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Cpu, Ruler, Sparkles } from "lucide-react"
import { aiFormulaValidator } from "@/ai/flows/ai-formula-validator"
import { suggestCuttingPatterns } from "@/ai/flows/ai-cutting-pattern-suggester"
import { useToast } from "@/hooks/use-toast"

export default function AiToolsPage() {
  const { toast } = useToast()
  
  // Formula Validator State
  const [formulaInput, setFormulaInput] = React.useState("(Width * 2) + (Height * 2)")
  const [formulaResult, setFormulaResult] = React.useState<any>(null)
  const [isValidating, setIsValidating] = React.useState(false)

  // Cutting Pattern State
  const [stockLengths, setStockLengths] = React.useState("20, 24")
  const [requiredCuts, setRequiredCuts] = React.useState("5.5 x 4, 3.2 x 8")
  const [cuttingResult, setCuttingResult] = React.useState<any>(null)
  const [isSuggesting, setIsSuggesting] = React.useState(false)

  const handleValidateFormula = async () => {
    setIsValidating(true)
    try {
      const result = await aiFormulaValidator({
        formulaToValidate: formulaInput,
        contextVariables: ["Width", "Height", "Qty", "Weight"]
      })
      setFormulaResult(result)
    } catch (error) {
      toast({ title: "Error", description: "Failed to validate formula." })
    } finally {
      setIsValidating(false)
    }
  }

  const handleSuggestCuts = async () => {
    setIsSuggesting(true)
    try {
      const stocks = stockLengths.split(',').map(s => parseFloat(s.trim()))
      const cutsStr = requiredCuts.split(',')
      const cuts = cutsStr.map(c => {
        const [len, qty] = c.split('x').map(v => parseFloat(v.trim()))
        return { length: len, quantity: qty || 1 }
      })

      const result = await suggestCuttingPatterns({
        requiredCuts: cuts,
        stockLengths: stocks
      })
      setCuttingResult(result)
    } catch (error) {
      toast({ title: "Error", description: "Failed to suggest cutting patterns." })
    } finally {
      setIsSuggesting(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold flex items-center gap-2">
            <Cpu className="h-5 w-5 text-accent" /> AI Engineering Tools
          </h1>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <Tabs defaultValue="patterns" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="patterns" className="gap-2"><Ruler className="h-4 w-4" /> Cutting Patterns</TabsTrigger>
              <TabsTrigger value="formulas" className="gap-2"><Sparkles className="h-4 w-4" /> Formula Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Optimization Inputs</CardTitle>
                    <CardDescription>Enter lengths and quantities to minimize waste.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Stock Lengths (comma separated)</Label>
                      <Input value={stockLengths} onChange={e => setStockLengths(e.target.value)} placeholder="20, 24" />
                    </div>
                    <div className="space-y-2">
                      <Label>Required Cuts (e.g. 5.5 x 4, 3.2 x 8)</Label>
                      <Textarea 
                        className="h-32"
                        value={requiredCuts} 
                        onChange={e => setRequiredCuts(e.target.value)} 
                        placeholder="Length x Qty, Length x Qty..." 
                      />
                    </div>
                    <Button 
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
                      onClick={handleSuggestCuts}
                      disabled={isSuggesting}
                    >
                      {isSuggesting ? "Optimizing..." : "Calculate Optimal Patterns"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-muted/20">
                  <CardHeader>
                    <CardTitle>Optimized Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!cuttingResult ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Ruler className="h-12 w-12 opacity-20 mb-4" />
                        <p>Awaiting inputs for optimization...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                          <p className="text-sm font-medium text-accent">{cuttingResult.overallEfficiencyMessage}</p>
                        </div>
                        <div className="space-y-4">
                          {cuttingResult.cuttingPatterns.map((pattern: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-3 space-y-2">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline">Stock: {pattern.stockLengthUsed}u</Badge>
                                <span className="text-xs text-destructive">Waste: {pattern.waste}u</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {pattern.cutsMade.map((cut: any, cidx: number) => (
                                  <Badge key={cidx} className="bg-primary/20 text-primary border-primary/20">
                                    {cut.quantity}x {cut.cutLength}u
                                  </Badge>
                                ))}
                              </div>
                              {pattern.comment && <p className="text-[10px] italic text-muted-foreground">{pattern.comment}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="formulas">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Formula Validation</CardTitle>
                    <CardDescription>Check the integrity of custom calculation logic.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Calculation Formula</Label>
                      <Input value={formulaInput} onChange={e => setFormulaInput(e.target.value)} />
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
                      <p className="font-bold">Available Variables:</p>
                      <p>Width, Height, Qty, Weight</p>
                    </div>
                    <Button 
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleValidateFormula}
                      disabled={isValidating}
                    >
                      {isValidating ? "Validating..." : "Validate Logic"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-muted/20">
                  <CardHeader>
                    <CardTitle>Validation Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!formulaResult ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Sparkles className="h-12 w-12 opacity-20 mb-4" />
                        <p>No validation results yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {formulaResult.isValid ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                          )}
                          <span className="font-bold">{formulaResult.isValid ? "Formula Valid" : "Issues Found"}</span>
                        </div>
                        <div className="p-4 bg-card rounded-lg border text-sm text-muted-foreground">
                          {formulaResult.validationFeedback}
                        </div>
                        {formulaResult.correctedFormula && (
                          <div className="space-y-2">
                            <Label className="text-xs">Corrected Suggestion</Label>
                            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg font-mono text-sm">
                              {formulaResult.correctedFormula}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}