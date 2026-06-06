"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { ChevronsUpDown } from "lucide-react";
import { UserDropdown } from "../auth/user-dropdown";

export const SidebarUserButton = () => {
  const session = useSession();
  const data = session.data?.user;

  const getInitials = () => {
    if (data?.name) {
      return data.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    if (data?.email) {
      return data.email[0].toUpperCase();
    }
    return "?";
  };

  const initials = getInitials();

  return (
    <UserDropdown>
      <SidebarMenuButton
        size="lg"
        className="bg-sidebar-accent/50 hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent h-14 rounded-xl border-none px-3"
      >
        <Avatar className="size-9 rounded-lg">
          <AvatarImage
            src={data?.image ?? ""}
            alt={data?.name ?? "User"}
            className="rounded-lg"
          />
          <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">
            {data?.name ?? "User"}
          </span>
          <span className="text-muted-foreground truncate text-xs">
            {data?.email}
          </span>
        </div>
        <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
      </SidebarMenuButton>
    </UserDropdown>
  );
};
