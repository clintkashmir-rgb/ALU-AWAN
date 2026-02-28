
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, TrendingUp, Users, Calculator, Layers } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { label: "Total Invoices", value: "128", icon: FileText, color: "text-blue-500" },
    { label: "Total Revenue", value: "PKR 4.2M", icon: TrendingUp, color: "text-green-500" },
    { label: "Active Customers", value: "45", icon: Users, color: "text-purple-500" },
    { label: "Pending Orders", value: "12", icon: PlusCircle, color: "text-orange-500" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">Dashboard</h1>
        </header>
        <main className="flex-1 space-y-6 p-4 md:p-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-none bg-card shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 md:col-span-2 border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest window orders and invoice generation.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Ahmed Khan</p>
                        <p className="text-[10px] text-muted-foreground uppercase">#AW-2024-00{i} • 2h ago</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-accent">PKR 45,000</p>
                        <p className="text-[10px] text-green-500 font-bold uppercase">Paid</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-3 h-12" asChild>
                  <Link href="/orders/new">
                    <PlusCircle className="h-5 w-5" />
                    New Window Order
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                  <Link href="/inventory/sections">
                    <Layers className="h-5 w-5" />
                    Manage Sections
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                  <Link href="/inventory/formulas">
                    <Calculator className="h-5 w-5" />
                    Section Formula Builder
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
