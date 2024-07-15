import { db } from "@/lib/db";
import ServerSidebarHeader from "./server-sidebar-header";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
  const user = await initialProfile();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
    include: {
      channels: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  console.log("server::::", server);

  if (!server) return redirect("/");
  return (
    <div className="p-2">
      <ServerSidebarHeader serverId={serverId} />
    </div>
  );
};

export default ServerSideBar;
