import InitialModal from "@/components/modals/intial-modal";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "../../lib/db";
import { redirect } from "next/navigation";

const SetUpPage = async () => {
  const user = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: user?.id,
        },
      },
    },
  });

  if (server) redirect(`servers/${server.id}`);

  return <InitialModal userId={user?.id} />;
};

export default SetUpPage;
