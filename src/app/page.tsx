import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, TrendingUp, Users, Cpu } from "lucide-react";
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="font-headline text-xl font-bold">Dashboard</h1>
        </header>
        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-none bg-card shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2 border-none shadow-md">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest window orders and invoice generation.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Customer: Ahmed Khan</p>
                        <p className="text-xs text-muted-foreground">Invoice #AW-2024-00{i} • 2 hours ago</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-accent">PKR 45,000</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
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
              <CardContent className="space-y-4">
                <Button className="w-full justify-start gap-2" asChild>
                  <Link href="/orders/new">
                    <PlusCircle className="h-4 w-4" />
                    New Window Order
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link href="/inventory/sections">
                    <Layers className="h-4 w-4" />
                    Manage Sections
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link href="/ai-tools">
                    <Cpu className="h-4 w-4" />
                    AI Formula Assistant
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

const Layers = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.85a2 2 0 0 0 0 3.58L11.17 15a2 2 0 0 0 1.66 0L21.4 10.43a2 2 0 0 0 0-3.58Z" />
    <path d="m2.6 14.16 8.57 4.7a2 2 0 0 0 1.66 0l8.57-4.7" />
    <path d="m2.6 19 8.57 4.7a2 2 0 0 0 1.66 0l8.57-4.7" />
  </svg>
);
