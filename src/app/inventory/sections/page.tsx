"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreVertical, Edit2, Trash2, Save, X } from "lucide-react"
import { mockSections } from "@/lib/mock-data"
import { Section } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function SectionsPage() {
  const { toast } = useToast()
  const [sections, setSections] = React.useState<Section[]>(mockSections)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  
  // Form state for adding/editing
  const [currentSection, setCurrentSection] = React.useState<Partial<Section>>({
    name: "",
    top_formula: "Width",
    bottom_formula: "Width",
    side_formula: "Height",
    weight_per_ft: 0.4,
    rate_per_ft: 220
  })

  const filteredSections = sections.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSaveSection = () => {
    if (!currentSection.name) {
      toast({ variant: "destructive", title: "Missing Info", description: "Section name is required." })
      return
    }

    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      name: currentSection.name || "",
      top_formula: currentSection.top_formula || "Width",
      bottom_formula: currentSection.bottom_formula || "Width",
      side_formula: currentSection.side_formula || "Height",
      weight_per_ft: currentSection.weight_per_ft || 0,
      rate_per_ft: currentSection.rate_per_ft || 0
    }

    setSections([...sections, newSection])
    setIsDialogOpen(false)
    setCurrentSection({
      name: "",
      top_formula: "Width",
      bottom_formula: "Width",
      side_formula: "Height",
      weight_per_ft: 0.4,
      rate_per_ft: 220
    })
    toast({ title: "Section Added", description: `${newSection.name} has been added to inventory.` })
  }

  const handleDelete = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
    toast({ title: "Section Deleted" })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">Aluminum Sections</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-11" 
                placeholder="Search sections..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="w-full md:w-auto h-11 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add Section
            </Button>
          </div>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="p-4 md:p-6">
              <CardTitle>Section Profiles & Formulas</CardTitle>
              <CardDescription>Define how top, bottom, and side pieces are calculated for each profile.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full whitespace-nowrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Section Name</TableHead>
                      <TableHead className="min-w-[120px]">Top Formula</TableHead>
                      <TableHead className="min-w-[120px]">Bottom Formula</TableHead>
                      <TableHead className="min-w-[120px]">Side Formula</TableHead>
                      <TableHead className="text-right">Weight (kg/ft)</TableHead>
                      <TableHead className="text-right">Rate (/ft)</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-bold">{section.name}</TableCell>
                        <TableCell className="font-mono text-xs">{section.top_formula}</TableCell>
                        <TableCell className="font-mono text-xs">{section.bottom_formula}</TableCell>
                        <TableCell className="font-mono text-xs">{section.side_formula}</TableCell>
                        <TableCell className="text-right">{section.weight_per_ft}</TableCell>
                        <TableCell className="text-right font-medium text-accent">{section.rate_per_ft}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Edit2 className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(section.id)}>
                                <Trash2 className="h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle>Define New Section Profile</DialogTitle>
              <DialogDescription>Set custom formulas for frame components.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input className="col-span-3" value={currentSection.name} onChange={e => setCurrentSection({...currentSection, name: e.target.value})} placeholder="e.g. DC30C" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Top Formula</Label>
                <Input className="col-span-3 font-mono text-xs" value={currentSection.top_formula} onChange={e => setCurrentSection({...currentSection, top_formula: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Bottom Formula</Label>
                <Input className="col-span-3 font-mono text-xs" value={currentSection.bottom_formula} onChange={e => setCurrentSection({...currentSection, bottom_formula: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Side Formula</Label>
                <Input className="col-span-3 font-mono text-xs" value={currentSection.side_formula} onChange={e => setCurrentSection({...currentSection, side_formula: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight (kg/ft)</Label>
                  <Input type="number" value={currentSection.weight_per_ft} onChange={e => setCurrentSection({...currentSection, weight_per_ft: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Rate (PKR/ft)</Label>
                  <Input type="number" value={currentSection.rate_per_ft} onChange={e => setCurrentSection({...currentSection, rate_per_ft: parseFloat(e.target.value)})} />
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1 bg-accent text-accent-foreground" onClick={handleSaveSection}>Save Section</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
