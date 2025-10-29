import { NavLink } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown,
  Grid3x3,
  List
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function AppSidebar() {
  const { state } = useSidebar();

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
  };

  return (
    <Sidebar className={state === 'collapsed' ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-4 py-4">
            <ShoppingBag className="h-6 w-6 text-primary" />
            {state !== 'collapsed' && <span className="font-bold text-lg">EcomAdmin</span>}
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Package className="h-4 w-4" />
                    {state !== 'collapsed' && (
                      <>
                        <span>Products</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink to="/products/categories" className={({ isActive }) => isActive ? 'bg-sidebar-accent' : ''}>
                          <Grid3x3 className="h-4 w-4" />
                          <span>Categories</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <NavLink to="/products/list" className={({ isActive }) => isActive ? 'bg-sidebar-accent' : ''}>
                          <List className="h-4 w-4" />
                          <span>Product List</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/sales" className={({ isActive }) => isActive ? 'bg-sidebar-accent' : ''}>
                  <BarChart3 className="h-4 w-4" />
                  {state !== 'collapsed' && <span>Sales</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/customers" className={({ isActive }) => isActive ? 'bg-sidebar-accent' : ''}>
                  <Users className="h-4 w-4" />
                  {state !== 'collapsed' && <span>Customers</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/analytics" className={({ isActive }) => isActive ? 'bg-sidebar-accent' : ''}>
                  <BarChart3 className="h-4 w-4" />
                  {state !== 'collapsed' && <span>Analytics</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/notifications" className={({ isActive }) => isActive ? 'bg-sidebar-accent' : ''}>
                  <Bell className="h-4 w-4" />
                  {state !== 'collapsed' && <span>Notifications</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'bg-sidebar-accent' : ''}>
                  <Settings className="h-4 w-4" />
                  {state !== 'collapsed' && <span>Settings</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4" />
                {state !== 'collapsed' && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
