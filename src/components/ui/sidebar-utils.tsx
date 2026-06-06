"use client";

import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import type { SidebarMenuButtonProps } from "./sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./sidebar";

const findBestMatch = (pathname: string, hrefs: string[]): string | null => {
  const matches = hrefs.filter(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );
  if (matches.length === 0) return null;
  return matches.reduce((best, current) =>
    current.length > best.length ? current : best,
  );
};

const SidebarMenuButtonLinkWithActive = ({
  href,
  isActive,
  children,
  className,
  ...props
}: SidebarMenuButtonProps & { href: string; isActive: boolean }) => {
  return (
    <SidebarMenuButton
      {...props}
      asChild
      isActive={isActive}
      className={cn(
        "h-10 rounded-lg px-3 font-medium transition-colors",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className,
      )}
    >
      <Link prefetch={true} href={href}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
};

export const SidebarMenuButtonLink = ({
  href,
  children,
  className,
  ...props
}: SidebarMenuButtonProps & { href: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuButton
      {...props}
      asChild
      isActive={isActive}
      className={cn(
        "h-10 rounded-lg px-3 font-medium transition-colors",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className,
      )}
    >
      <Link prefetch={true} href={href}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
};

export const SidebarSubButtonLink = ({
  href,
  children,
  className,
  ...props
}: ComponentProps<typeof SidebarMenuSubButton> & { href: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuSubButton
      {...props}
      asChild
      isActive={isActive}
      className={cn(
        "h-9 rounded-lg px-3 font-medium transition-colors",
        isActive && "bg-sidebar-accent/50 text-sidebar-accent-foreground",
        className,
      )}
    >
      <Link prefetch={true} href={href}>
        {children}
      </Link>
    </SidebarMenuSubButton>
  );
};

export const SidebarNavigationMenu = (props: { link: NavigationGroup }) => {
  const { link } = props;
  const pathname = usePathname();

  const allHrefs = link.links.flatMap((item) =>
    item.links
      ? [item.href, ...item.links.map((sub) => sub.href)]
      : [item.href],
  );
  const bestMatch = findBestMatch(pathname, allHrefs);

  return (
    <SidebarMenu className="gap-1">
      {link.links.map((item) => {
        if (item.links) {
          return (
            <Collapsible
              defaultOpen
              key={item.label}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButtonLinkWithActive
                  href={item.href}
                  isActive={bestMatch === item.href}
                >
                  <item.Icon className="size-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <CollapsibleTrigger
                    className="ml-auto"
                    onClick={(e) => e.preventDefault()}
                  >
                    <ChevronRight className="text-muted-foreground size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarMenuButtonLinkWithActive>

                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 ml-4 border-l-0 pl-4">
                    {item.links.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.label}>
                        <SidebarSubButtonLink href={subItem.href}>
                          <subItem.Icon className="size-4 shrink-0" />
                          <span>{subItem.label}</span>
                        </SidebarSubButtonLink>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButtonLinkWithActive
              href={item.href}
              isActive={bestMatch === item.href}
            >
              <item.Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </SidebarMenuButtonLinkWithActive>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
