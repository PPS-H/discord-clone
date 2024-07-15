import ServerSideBar from "@/components/servers/server-sidebar";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface serverLayoutProps {
  children: ReactNode;
  params: { id: string };
}

const ServerLayout: FC<serverLayoutProps> = async ({ children, params }) => {
  const user = await initialProfile();

  console.log("user here", params);

  if (!user) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: params.id,
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="flex">
      <div className="h-full w-60">
        <ServerSideBar serverId={params.id} />
      </div>
      <main className="h-full">{children}</main>
    </div>
  );
};

export default ServerLayout;
