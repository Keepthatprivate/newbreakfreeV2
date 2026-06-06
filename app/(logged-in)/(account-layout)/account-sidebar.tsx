"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNavigationMenu } from "@/components/ui/sidebar-utils";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import Image from "next/image";
import { getAccountNavigation } from "./account.links";

export function AccountSidebar() {
  const links: NavigationGroup[] = getAccountNavigation();

  return (
    <Sidebar variant="inset" className="border-none">
      <SidebarHeader className="p-4 pb-0">
        <div className="flex items-center gap-3 px-1">
          <Image
            src="/images/icon.png"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-caption text-lg font-semibold tracking-tight">
            BoilerSaaS
          </span>
        </div>
      </SidebarHeader>

      <Separator className="mx-4 mt-4 w-auto" />

      <SidebarContent className="px-2 pt-2">
        {links.map((link) => (
          <SidebarGroup key={link.title} className="px-2 py-0">
            <SidebarGroupContent>
              <SidebarNavigationMenu link={link} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarUserButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
