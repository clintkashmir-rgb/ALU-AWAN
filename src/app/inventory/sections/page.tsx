
"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreVertical, Edit2, Trash2, Layers } from "lucide-react"
import { Section } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useFirestore } from "@/firebase"
import { collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"

export default function SectionsPage() {
  const { toast } = useToast()
  const firestore = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  
  // Firestore data
  const { data: sections, loading } = useCollection<Section>(
    firestore ? collection(firestore, "sections") : null
  )

  const [currentSection, setCurrentSection] = React.useState<Partial<Section>>({
    name: "",
    type: "Sliding",
    top_formula: "Width + 0",
    bottom_formula: "Width + 0",
    side_formula: "Height + 0",
    weight_per_ft: 0.4,
    rate_per_ft: 220
  })

  const filteredSections = sections?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleSaveSection = async () => {
    if (!currentSection.name) {
      toast({ variant: "destructive", title: "Missing Info", description: "Section name is required." })
      return
    }

    try {
      await addDoc(collection(firestore, "sections"), currentSection)
      setIsDialogOpen(false)
      setCurrentSection({
        name: "",
        type: "Sliding",
        top_formula: "Width + 0",
        bottom_formula: "Width + 0",
        side_formula: "Height + 0",
        weight_per_ft: 0.4,
        rate_per_ft: 220
      })
      toast({ title: "Section Added", description: `${currentSection.name} saved online.` })
    } catch (e) {
      toast({ variant: "destructive", title: "Error Saving" })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, "sections", id))
      toast({ title: "Section Deleted" })
    } catch (e) {
      toast({ variant: "destructive", title: "Delete Failed" })
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold flex items-center gap-2 uppercase">
            <Layers className="h-5 w-5 text-accent" /> Aluminum Inventory
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 h-12" 
                placeholder="Search profiles..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="w-full md:w-auto h-12 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" /> ADD NEW PROFILE
            </Button>
          </div>

          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Configured Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full whitespace-nowrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Top Logic</TableHead>
                      <TableHead>Side Logic</TableHead>
                      <TableHead className="text-right">Rate (/ft)</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-12 opacity-50">Loading sections...</TableCell></TableRow>
                    ) : filteredSections.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-12 opacity-50">No sections found. Add one to start.</TableCell></TableRow>
                    ) : (
                      filteredSections.map((section) => (
                        <TableRow key={section.id}>
                          <TableCell className="font-black text-accent">{section.name}</TableCell>
                          <TableCell className="text-xs uppercase font-bold">{section.type}</TableCell>
                          <TableCell className="font-mono text-xs opacity-70">{section.top_formula}</TableCell>
                          <TableCell className="font-mono text-xs opacity-70">{section.side_formula}</TableCell>
                          <TableCell className="text-right font-black">PKR {section.rate_per_ft}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(section.id!)}>
                                  <Trash2 className="h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="uppercase font-black">New Section Profile</DialogTitle>
              <DialogDescription>Add a new aluminum profile for calculations.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Profile Name</Label>
                <Input value={currentSection.name} onChange={e => setCurrentSection({...currentSection, name: e.target.value})} placeholder="e.g. DC30C" />
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-accent text-accent-foreground font-bold" onClick={handleSaveSection}>SAVE PROFILE</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
