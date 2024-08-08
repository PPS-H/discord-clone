import { db } from "@/lib/db";
import { initialProfilePages } from "@/lib/initial-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method != "POST")
    return res.status(400).json({
      success: false,
      message: "Method not allowed",
    });

  try {
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    console.log("server id :::", serverId, channelId);

    if (!serverId || !channelId)
      return res.status(400).json({
        success: false,
        message: "You are not authorized to send the message",
      });

    if (!content)
      return res
        .status(400)
        .json({ success: false, message: "Message cannot be empty." });

    const user = await initialProfilePages(req);

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Please login to send the message" });

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
    const message = await db.message.create({
      data: {
        content,
        fileUrl: fileUrl ? fileUrl : null,
        memberId: member.id,
        channelId: channelId as string,
      },
    });

    res.status(201).json({
      succcess: true,
      message,
    });
  } catch (error) {
    console.log("Error while sending message", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default handler;
