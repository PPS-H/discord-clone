import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import { NextApiRequest } from "next";

export const initialProfilePages = async (req: NextApiRequest) => {
  const user = await getAuth(req);

  if (!user || !user.userId) {
    return redirect("/signin");
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.userId,
    },
  });
  return profile;
};
