import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export const GET = async (req: Request, res: NextApiResponseServerIo) => {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    const user = await currentUser();

    if (!user)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You are not authorized to access the route",
        }),
        { status: 400 }
      );

    if (!conversationId)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "ConversationId is required",
        }),
        { status: 400 }
      );

    let messages = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor as string,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId,
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
      nextCursor = messages[messages.length - 1].id;
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, messages);

    return NextResponse.json({
      // messages,
      items: messages,
      nextCursor,
    });
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
