import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import ServerSideBar from "./servers/server-sidebar";
import NavigationSidebar from "./navigation/navigation-sidebar";
import { Button } from "./ui/button";

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button className="md:hidden" variant="ghost" size="icon">
        <Menu />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="p-0 flex gap-0">
      <div className="w-[72px]">
        <NavigationSidebar />
      </div>
      <ServerSideBar serverId={serverId} />
    </SheetContent>
  </Sheet>
  );
};

export default MobileToggle;
