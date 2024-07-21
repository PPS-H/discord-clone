import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const body = await req.json();
    const { serverId } = params;
    const { name, imageUrl } = body;
    const user = await initialProfile();

    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 401 }
      );

    const existingServer = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: user.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    if (!existingServer)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Server not found",
        }),
        { status: 400 }
      );

    const server = await db.server.update({
      where: {
        id: serverId,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Server updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const { serverId } = params;

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

    if (memeber?.role !== MemberRole.ADMIN)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to delete the server.",
        }),
        { status: 400 }
      );

    await db.server.delete({
      where: {
        id: serverId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Server deleted successfully",
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
