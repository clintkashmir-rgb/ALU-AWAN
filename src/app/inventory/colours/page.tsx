"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Plus, Trash2, Search } from "lucide-react"
import { mockColours } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function ColoursPage() {
  const { toast } = useToast()
  const [colours, setColours] = React.useState(mockColours)
  const [newColour, setNewColour] = React.useState("")

  const handleAdd = () => {
    if (!newColour) return
    setColours([...colours, { id: Math.random().toString(), name: newColour }])
    setNewColour("")
    toast({ title: "Colour Added" })
  }

  const handleDelete = (id: string) => {
    setColours(colours.filter(c => c.id !== id))
    toast({ title: "Colour Removed" })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">Manage Colours</h1>
        </header>
        <main className="flex-1 p-6 space-y-6 max-w-xl">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Add New Colour</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input 
                placeholder="e.g. Ral 9016 White" 
                value={newColour} 
                onChange={e => setNewColour(e.target.value)}
              />
              <Button onClick={handleAdd} className="bg-accent text-accent-foreground">
                <Plus className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {colours.map(c => (
              <Card key={c.id} className="border-none shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-accent" />
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
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
