"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNavigationMenu } from "@/components/ui/sidebar-utils";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import { ArrowLeft, CreditCard } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getOrganizationNavigation } from "./org-navigation.links";

const OrgCommand = dynamic(
  async () => import("./org-command").then((mod) => mod.OrgCommand),
  { ssr: false },
);

export function OrgSidebar({
  slug,
  roles,
}: {
  slug: string;
  roles: AuthRole[] | undefined;
}) {
  const pathname = usePathname();
  const allLinks: NavigationGroup[] = getOrganizationNavigation(slug, roles);

  const isBillingPage = pathname.includes("/settings/billing");

  const links = useMemo(() => {
    if (isBillingPage) {
      return allLinks.filter((group) => group.title === "Billing");
    }
    return allLinks.filter((group) => group.title === "Menu");
  }, [allLinks, isBillingPage]);

  return (
    <Sidebar variant="inset" className="border-none">
      {/* Header */}
      <SidebarHeader className="p-4 pb-0">
        {isBillingPage ? (
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground -ml-2 w-fit justify-start gap-2"
              asChild
            >
              <Link href={`/orgs/${slug}`} prefetch={false}>
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Link>
            </Button>
            <div className="flex items-center gap-3 px-1">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                <CreditCard className="text-primary size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Billing</span>
                <span className="text-muted-foreground text-xs">
                  Manage your subscription
                </span>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </SidebarHeader>

      {/* Search - only on main pages */}
      {!isBillingPage && (
        <div className="px-4 py-3">
          <OrgCommand />
        </div>
      )}

      <Separator className="mx-4 w-auto" />

      {/* Navigation Content */}
      <SidebarContent className="px-2 pt-2">
        {links.map((link) => (
          <SidebarGroup key={link.title} className="px-2 py-0">
            {isBillingPage && (
              <SidebarGroupLabel className="text-muted-foreground mb-1 px-2 text-xs font-medium tracking-wider uppercase">
                {link.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarNavigationMenu link={link} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4">
        {!isBillingPage && (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent mb-1 h-9 justify-start gap-2 rounded-lg px-3"
            >
              <Link href={`/orgs/${slug}/settings/billing`} prefetch={false}>
                <CreditCard className="size-4" />
                <span>Billing</span>
              </Link>
            </Button>
            <Separator className="my-2" />
          </>
        )}
        <SidebarUserButton />
      </SidebarFooter>

      {/* Rail for collapse */}
      <SidebarRail />
    </Sidebar>
  );
}
