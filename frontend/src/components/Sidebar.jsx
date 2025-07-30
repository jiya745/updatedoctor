import React from 'react'
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar'

import {
    Users,
    Calendar,
    Activity,
    Settings,
    Home,
    UserCheck,
    BarChart3,
    PieChart,
    FileText,
    Bell,
    LogOut,
    MessageSquare,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom';



const AdminSidebar = ({ children, error, title }) => {
    const pathname = useLocation().pathname;
    const sidebarMenuItems = [
        {
            title: "Dashboard",
            items: [
                { title: "Overview", icon: Home, isActive: pathname == "/admin/dashboard",href:"/admin/dashboard" },
                { title: "Feedback", icon: MessageSquare, isActive: pathname == "/admin/feedback",href:"/admin/feedback" }
            ]
        },
        {
            title: "Management",
            items: [
                { title: "Users", icon: Users, isActive: pathname == "/admin/users",href:"/admin/users" },
                { title: "Sessions", icon: Calendar, isActive: pathname == "/admin/sessions",href:"/admin/sessions" }
            ]
        },
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar */}
                <Sidebar className="w-64">
                    <SidebarHeader className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <UserCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Admin Panel</h2>
                                <p className="text-sm text-muted-foreground">Doctor Assistant</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="px-2">
                        {sidebarMenuItems.map((group, groupIndex) => (
                            <SidebarGroup key={groupIndex}>
                                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {group.title}
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item, itemIndex) => (
                                            <SidebarMenuItem key={itemIndex}>
                                                <SidebarMenuButton asChild isActive={item.isActive}>
                                                    <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                                                        <item.icon className="h-4 w-4" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </SidebarContent>

                    {/* Sidebar Footer */}
                    <div className="mt-auto p-4 border-t">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <button className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left hover:bg-sidebar-accent">
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                </Sidebar>

                {/* Main Content */}
                <SidebarInset className="flex-1">
                    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                        <SidebarTrigger className="-ml-1" />
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{title}</h1>
                            <p className="text-muted-foreground">
                                {error ? error : "Welcome to the admin dashboard"}
                            </p>
                        </div>
                    </header>
                    {children}
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default AdminSidebar
