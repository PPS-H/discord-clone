import { db } from "@/lib/db";
import { initialProfilePages } from "@/lib/initial-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method != "PATCH" && req.method != "DELETE")
    return res.status(400).json({
      success: false,
      message: "Method not allowed",
    });

  try {
    const user = await initialProfilePages(req);

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Please login to send the message" });

    const { content } = req.body;
    const { messageId, conversationId } = req.query;

    console.log("conversationId::::", conversationId, messageId);

    if (!conversationId)
      return res.status(400).json({
        success: false,
        message: "You are not authorized to edit the message",
      });

    if (req.method == "PATCH" && !content)
      return res
        .status(400)
        .json({ success: false, message: "Message cannot be empty." });

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId as string,
      },
    });

    if (!conversation)
      return res
        .status(400)
        .json({ success: false, message: "Conversation not found" });


    let message = await db.directMessage.findUnique({
      where: {
        id: messageId as string,
      },
    });

    if (!message)
      return res
        .status(400)
        .json({ success: false, message: "Message not found" });

    if (req.method == "PATCH") {
      message = await db.directMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method == "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: "This message is deleted",
          fileUrl: null,
          isDelete: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const key = `chat:${conversationId}:message:update`;
    res?.socket?.server?.io.emit(key, message);

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log("Error while sending message", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default handler;
