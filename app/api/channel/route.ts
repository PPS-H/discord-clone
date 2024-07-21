import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { serverId, channelName, channelType } = body;

    const user = await initialProfile();
    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "unquthorized",
        })
      );

    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        channels: {
          create: [
            {
              name: channelName,
              type: channelType,
              profileId: user.id,
            },
          ],
        },
      },
    });
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Channel created successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error,
      }),
      { status: 400 }
    );
  }
};
