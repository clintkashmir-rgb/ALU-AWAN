
"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Printer, MoreVertical, LayoutList } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { useFirestore } from "@/firebase/provider"
import { useRouter } from "next/navigation"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const firestore = useFirestore()
  const router = useRouter()
  
  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "invoices"), orderBy("timestamp", "desc"));
  }, [firestore]);

  const { data: invoices, isLoading: loading } = useCollection(invoicesQuery);

  const filteredInvoices = React.useMemo(() => {
    if (!invoices) return [];
    return invoices.filter(o => 
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  const handlePrint = (id: string) => {
    router.push(`/invoices/print?id=${id}`);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
            <LayoutList className="h-5 w-5 text-accent" /> Invoice History
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by customer or invoice #..." 
                className="pl-10 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card className="border-none shadow-xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 py-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 text-accent" /> Compiled Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/10 border-b">
                    <TableHead className="font-black text-[10px] uppercase">Invoice #</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Customer</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Date</TableHead>
                    <TableHead className="text-right font-black text-[10px] uppercase">Net Amount</TableHead>
                    <TableHead className="font-black text-[10px] uppercase">Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 font-black animate-pulse opacity-50 uppercase tracking-widest">Fetching industrial history...</TableCell></TableRow>
                  ) : filteredInvoices.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 font-bold opacity-30 uppercase">No orders found in the database.</TableCell></TableRow>
                  ) : filteredInvoices.map((inv) => (
                    <TableRow key={inv.id} className="hover:bg-muted/5 transition-colors border-b">
                      <TableCell className="font-mono font-bold text-xs text-muted-foreground">
                        {inv.invoiceNumber || `ID-${inv.id.slice(0, 4)}`}
                      </TableCell>
                      <TableCell className="font-black text-accent uppercase">{inv.customerName}</TableCell>
                      <TableCell className="text-[10px] font-bold text-muted-foreground">{inv.date}</TableCell>
                      <TableCell className="text-right font-black text-lg">PKR {inv.netAmount?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 font-black text-[10px] uppercase">
                          {inv.status || "Paid"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-accent/10 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-2">
                            <DropdownMenuItem className="gap-2 font-bold cursor-pointer" onClick={() => handlePrint(inv.id)}>
                              <Printer className="h-4 w-4 text-accent" /> Print Official Bill
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
