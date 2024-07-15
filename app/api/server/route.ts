import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { initialProfile } from "@/lib/initial-profile";
import { v4 as uuid } from "uuid";

type ResponseData = {
  message: string;
};

export const POST = async (req: Request, res: NextResponse<ResponseData>) => {
  try {
    const body = await req.json();

    const { name, imageUrl } = body;

    const user = await initialProfile();
    // console.log("userdata:::",user)

    // const user = await db.profile.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    console.log("user:::", user);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to create server.",
        }),
        { status: 400 }
      );
    }

    const profileId = user.id;
    const server = await db.server.create({
      data: {
        name,
        profileId,
        imageUrl,
        inviteCode: uuid(),
        channels: {
          create: [{ name: "general", profileId: profileId }],
        },
        members: {
          create: [{ profileId, role: MemberRole.ADMIN }],
        },
      },
    });

    return new NextResponse(JSON.stringify(server), { status: 201 });
  } catch (error) {
    console.log("Error while creating server:", error);
  }
};