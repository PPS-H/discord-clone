import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {
  try {
    const body = await req.json();
    const { role, kick } = body;
    const { memberId } = params;

    const user = await initialProfile();

    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 201 }
      );

    const member = await db.member.findFirst({
      where: {
        profileId: user.id,
      },
    });

    if (member?.role !== MemberRole.ADMIN)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to change member role",
        }),
        { status: 400 }
      );

    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            id: memberId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Member not found",
        }),
        { status: 400 }
      );

    const serverMember = server.members.find(
      (memeber) => memeber.id === memberId
    );

    if (serverMember?.role === MemberRole.ADMIN)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: role
            ? "ADMIN role can't be changed."
            : "ADMIN can't leave the server",
        }),
        { status: 400 }
      );
    let updatedServer = {};
    if (role) {
      updatedServer = await db.server.update({
        where: {
          id: server.id,
          profileId: user.id,
        },
        data: {
          members: {
            update: {
              where: {
                id: memberId,
              },
              data: {
                role,
              },
            },
          },
        },
        include: {
          channels: true,
          members: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (kick) {
      updatedServer = await db.server.update({
        where: {
          id: server.id,
        },
        data: {
          members: {
            deleteMany: {
              id: memberId,
            },
          },
        },
        include: {
          channels: true,
          members: {
            include: {
              profile: true,
            },
          },
        },
      });

      await db.member.deleteMany({
        where: {
          id: memberId,
          serverId: serverMember?.serverId,
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: role
          ? "Member role updated successfully"
          : "Member removed successfully",
        server: updatedServer,
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
