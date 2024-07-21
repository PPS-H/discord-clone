import { db } from "@/lib/db";
import ServerSidebarHeader from "./server-sidebar-header";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
  const user = await initialProfile();

  console.log("user is user:::", user);

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

  const member = server.members.find((member) => member.profileId === user.id);

  const role = member?.role;

  console.log("server::::", server);
  // console.log("role::::", role);

  return (
    <div className="p-2">
      <ServerSidebarHeader server={server} role={role!} />
    </div>
  );
};

export default ServerSideBar;
