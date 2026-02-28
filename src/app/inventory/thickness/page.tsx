"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Boxes, Plus, Trash2 } from "lucide-react"
import { mockThickness } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function ThicknessPage() {
  const { toast } = useToast()
  const [thicknesses, setThicknesses] = React.useState(mockThickness)
  const [newVal, setNewVal] = React.useState("")

  const handleAdd = () => {
    if (!newVal) return
    setThicknesses([...thicknesses, { id: Math.random().toString(), value: newVal }])
    setNewVal("")
    toast({ title: "Thickness Added" })
  }

  const handleDelete = (id: string) => {
    setThicknesses(thicknesses.filter(t => t.id !== id))
    toast({ title: "Thickness Removed" })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">Section Thickness</h1>
        </header>
        <main className="flex-1 p-6 space-y-6 max-w-xl">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Add New Thickness</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input 
                placeholder="e.g. 1.6mm" 
                value={newVal} 
                onChange={e => setNewVal(e.target.value)}
              />
              <Button onClick={handleAdd} className="bg-accent text-accent-foreground">
                <Plus className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            {thicknesses.map(t => (
              <Card key={t.id} className="border-none shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Boxes className="h-4 w-4 text-accent" />
                    <span className="font-mono">{t.value}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
