import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

interface InviteServerProps {
  params: { inviteCode: string };
}

const InviteOnServer = async ({ params }: InviteServerProps) => {
  const { inviteCode } = params;
  const user = await initialProfile();

  const existingServer = await db.server.findUnique({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: { create: [{ profileId: user.id, role: MemberRole.GUEST }] },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
};

export default InviteOnServer;
