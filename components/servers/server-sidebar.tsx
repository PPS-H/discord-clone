import { db } from "@/lib/db";
import ServerSidebarHeader from "./server-sidebar-header";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { profile } from "console";

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
  const user = await initialProfile();

  // console.log("user is user:::", user);

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
      channels: true,
      members: {
        include: {
          profile: true,
        },
      },
    },
  });
  if (!server) return redirect("/");

  const role = server.members[0].role;

  // console.log("server::::", server);
  // console.log("role::::", role);

  return (
    <div className="p-2">
      <ServerSidebarHeader server={server} role={role} />
    </div>
  );
};

export default ServerSideBar;
