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
    const { messageId, serverId, channelId } = req.query;

    console.log("data here:", content, messageId, serverId, channelId);

    if (!serverId || !channelId || !messageId)
      return res.status(400).json({
        success: false,
        message: "You are not authorized to edit the message",
      });

    if (req.method == "PATCH" && !content)
      return res
        .status(400)
        .json({ success: false, message: "Message cannot be empty." });

    const server = await db.server.findUnique({
      where: {
        id: serverId as string,
        profileId: user.id,
      },
      include: {
        members: true,
      },
    });

    if (!server)
      return res
        .status(400)
        .json({ success: false, message: "Server not found" });

    const channel = await db.channel.findUnique({
      where: {
        id: channelId as string,
      },
    });

    if (!channel)
      return res
        .status(400)
        .json({ success: false, message: "Channel not found" });

    const member = server.members.find((member) => member.profileId == user.id);

    if (!member)
      return res
        .status(400)
        .json({ success: false, message: "Member not found" });

    console.log("member::::", member);

    let message = await db.message.findUnique({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
    });

    if (!message)
      return res
        .status(400)
        .json({ success: false, message: "Message not found" });

    if (req.method == "PATCH") {
      message = await db.message.update({
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
      message = await db.message.update({
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
