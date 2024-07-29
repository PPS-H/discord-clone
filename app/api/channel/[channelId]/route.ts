import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const body = await req.json();
    const { channelId } = params;
    const { channelName, channelType } = body;
    const user = await initialProfile();

    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 401 }
      );

    const member = await db.member.findFirst({
      where: {
        profileId: user.id,
      },
    });

    if (member?.role == MemberRole.GUEST)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You're not authorized to edit the channel details",
        }),
        { status: 400 }
      );

    const server = await db.channel.update({
      where: {
        id: channelId,
      },
      data: {
        name: channelName,
        type: channelType,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Channel updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const { channelId } = params;

    const user = await initialProfile();

    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 401 }
      );

    const memeber = await db.member.findFirst({
      where: {
        profileId: user.id,
      },
    });

    if (memeber?.role == MemberRole.GUEST)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to delete the channel.",
        }),
        { status: 400 }
      );

    await db.channel.delete({
      where: {
        id: channelId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Channel deleted successfully",
      }),
      { status: 200 }
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
