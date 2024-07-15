import { db } from "@/lib/db";
import { ChevronDown } from "lucide-react";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ServerSidebarHeader = async ({ serverId }: { serverId: string }) => {
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
  });

  console.log("server::::", server);

  if (!server) return redirect("/");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full" asChild>
        <div className="flex justify-between items-center">
          {server.name}
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="w-full">Invite</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerSidebarHeader;
