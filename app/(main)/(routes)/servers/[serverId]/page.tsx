import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

interface ServerPageProps {
  params: {
    serverId: string;
  };
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const user = await initialProfile();

  if (!user) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
      },
    },
  });

  console.log("server",server)

  const channel = server?.channels[0];

  return redirect(`/servers/${params.serverId}/channels/${channel?.id}`);
};

export default ServerPage;
