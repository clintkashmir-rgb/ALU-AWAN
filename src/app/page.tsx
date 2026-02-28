
"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, TrendingUp, Users, Calculator, Layers, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import React from "react";

export default function DashboardPage() {
  const firestore = useFirestore();
  
  const ordersQuery = React.useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "orders"), orderBy("timestamp", "desc"));
  }, [firestore]);

  const sectionsQuery = React.useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "sections");
  }, [firestore]);

  const { data: orders } = useCollection<any>(ordersQuery);
  const { data: sections } = useCollection<any>(sectionsQuery);

  const totalRevenue = orders?.reduce((sum, o) => sum + (o.netAmount || 0), 0) || 0;
  const totalInvoices = orders?.length || 0;
  const totalSections = sections?.length || 0;

  const stats = [
    { label: "Total Invoices", value: totalInvoices, icon: FileText, color: "text-blue-500" },
    { label: "Total Revenue", value: `PKR ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-500" },
    { label: "Sections Configured", value: totalSections, icon: Layers, color: "text-purple-500" },
    { label: "Active Orders", value: totalInvoices, icon: PlusCircle, color: "text-orange-500" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold flex items-center gap-2 uppercase">
            <LayoutDashboard className="h-5 w-5 text-accent" /> Dashboard
          </h1>
        </header>
        <main className="flex-1 space-y-6 p-4 md:p-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-none bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                  <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-black">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="col-span-1 md:col-span-2 border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!orders || orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-20">
                    <FileText className="h-16 w-16 mb-4" />
                    <p className="text-sm font-bold uppercase">No orders recorded yet.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {orders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                        <div className="space-y-1">
                          <p className="font-black text-accent">{order.customerName}</p>
                          <p className="text-[10px] text-muted-foreground">{order.date} • {order.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black">PKR {order.netAmount?.toLocaleString()}</p>
                          <p className="text-[8px] uppercase text-green-500 font-bold">Saved Online</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-accent/5 border-2 border-dashed border-accent/20">
              <CardHeader>
                <CardTitle className="text-sm uppercase font-black tracking-widest">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-3 h-14 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg font-bold" asChild>
                  <Link href="/orders/new">
                    <PlusCircle className="h-5 w-5" />
                    NEW ORDER
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-14 bg-background border-2 font-bold" asChild>
                  <Link href="/inventory/sections">
                    <Layers className="h-5 w-5" />
                    MANAGE SECTIONS
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-14 bg-background border-2 font-bold" asChild>
                  <Link href="/inventory/formulas">
                    <Calculator className="h-5 w-5" />
                    FORMULA BUILDER
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
