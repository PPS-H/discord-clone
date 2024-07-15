import { Separator } from "@/components/ui/separator";
import NavigationAction from "./navigation-action";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const user = await initialProfile();
  if (!user) redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
  });
  // console.log("servers:::", servers);
  return (
    <div className="dark:bg-black bg-white h-full ">
      <div className="">
        <NavigationAction />
        <Separator />
      </div>

      <ScrollArea className="w-full mt-3">
        {servers.map((server) => (
          <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
        ))}
      </ScrollArea>

      <div className="absolute bottom-5 flex flex-col justify-center items-center space-y-4 w-full">
        <ModeToggle />
        <UserButton/>
      </div>
    </div>
  );
};

export default NavigationSidebar;
