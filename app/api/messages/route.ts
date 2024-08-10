import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    const user = await currentUser();

    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to access the route",
        }),
        { status: 400 }
      );

    if (!channelId)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "ChannelId is required",
        }),
        { status: 400 }
      );

    let messages = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor as string,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length == MESSAGE_BATCH) {
      nextCursor = messages[length - 1].id;
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        messages,
        nextCursor,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching the messages", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
