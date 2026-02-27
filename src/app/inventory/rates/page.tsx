"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, History, RefreshCcw } from "lucide-react"
import { mockRates } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function RatesPage() {
  const { toast } = useToast()
  const [rates, setRates] = React.useState(mockRates)

  const handleSave = () => {
    toast({ title: "Rates Updated", description: "Global calculation rates have been synchronized." })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">Standard Rates</h1>
        </header>

        <main className="flex-1 p-6 space-y-6 max-w-2xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Calculation Rates</CardTitle>
                <Button variant="outline" size="icon" title="Reset to Defaults">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>These rates are applied to all new window orders and quotes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="al-rate">Aluminum Rate (per kg)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">PKR</span>
                    <Input id="al-rate" className="pl-12" type="number" value={rates.aluminum_rate_per_kg} onChange={e => setRates({...rates, aluminum_rate_per_kg: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gl-rate">Glass Rate (per sqft)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">PKR</span>
                    <Input id="gl-rate" className="pl-12" type="number" value={rates.glass_rate_per_sqft} onChange={e => setRates({...rates, glass_rate_per_sqft: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hw-rate">Hardware Rate (per item)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">PKR</span>
                    <Input id="hw-rate" className="pl-12" type="number" value={rates.hardware_rate} onChange={e => setRates({...rates, hardware_rate: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lb-rate">Labour Rate (per sqft)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">PKR</span>
                    <Input id="lb-rate" className="pl-12" type="number" value={rates.labour_rate_per_sqft} onChange={e => setRates({...rates, labour_rate_per_sqft: parseFloat(e.target.value)})} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="ghost" className="gap-2">
                <History className="h-4 w-4" /> View History
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Save className="h-4 w-4" /> Update Rates
              </Button>
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}