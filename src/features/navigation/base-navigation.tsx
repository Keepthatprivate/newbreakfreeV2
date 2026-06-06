import { Typography } from "@/components/custom/typography";
import { SiteConfig } from "@/site-config";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarMenuButtonLink } from "@/components/ui/sidebar-utils";
import { Layout } from "@/features/page/layout";
import { Building2, Home, User } from "lucide-react";
import type { PropsWithChildren } from "react";
import { SidebarUserButton } from "../sidebar/sidebar-user-button";

export function BaseNavigation({ children }: PropsWithChildren) {
  return (
    <SidebarProvider id="app-sidebar">
      <BaseSidebar />
      <SidebarInset className="border-border border">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <Layout size="lg">
            <SidebarTrigger
              variant="outline"
              className="size-8 cursor-pointer"
            />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const BaseSidebar = () => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="mb-4 flex flex-row items-center gap-2">
          <Image
            src="/images/icon.png"
            alt={SiteConfig.title}
            width={24}
            height={24}
          />
          <Typography>{SiteConfig.title}</Typography>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButtonLink href="/orgs">
              <Building2 />
              <span>Organization</span>
            </SidebarMenuButtonLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButtonLink href="/home">
              <Home />
              <span>Home</span>
            </SidebarMenuButtonLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButtonLink href="/account">
              <User />
              <span>Account</span>
            </SidebarMenuButtonLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <SidebarUserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
