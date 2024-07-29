import ServerSideBar from "@/components/servers/server-sidebar";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface serverLayoutProps {
  children: ReactNode;
  params: { serverId: string };
}

const ServerLayout: FC<serverLayoutProps> = async ({ children, params }) => {
  const user = await initialProfile();

  if (!user) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
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
      <div className="hidden md:block h-full w-60">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="h-full md:w-[calc(100%-15rem)] w-full">{children}</main>
    </div>
  );
};

export default ServerLayout;
