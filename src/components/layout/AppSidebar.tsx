
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  PlusCircle, 
  Settings, 
  Boxes,
  Palette,
  Layers,
  CircleDollarSign,
  Calculator,
  LogOut,
  User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: PlusCircle, label: "New Order", href: "/orders/new" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
]

const inventoryItems = [
  { icon: Layers, label: "Sections", href: "/inventory/sections" },
  { icon: Calculator, label: "Formulas", href: "/inventory/formulas" },
  { icon: Palette, label: "Colours", href: "/inventory/colours" },
  { icon: Boxes, label: "Thickness", href: "/inventory/thickness" },
  { icon: CircleDollarSign, label: "Rates", href: "/inventory/rates" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({ title: "Signed Out", description: "Safe travels!" })
      router.push("/login")
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to sign out." })
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-lg">
            <Package className="h-6 w-6" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-headline font-bold text-lg leading-none tracking-tight">Awan Manager</span>
            <span className="text-xs text-muted-foreground mt-1">Industrial Precision</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Inventory Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inventoryItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <div className="px-2 py-2 mb-2 flex items-center gap-2 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold truncate">{user.email || "Guest User"}</span>
                  <span className="text-[10px] text-muted-foreground">Active Account</span>
                </div>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10" tooltip="Sign Out">
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
