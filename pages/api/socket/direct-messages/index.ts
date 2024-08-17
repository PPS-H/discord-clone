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
    const user = await initialProfilePages(req);

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Please login to send the message" });

    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!conversationId)
      return res.status(400).json({
        success: false,
        message: "You are not authorized to send the message",
      });

    if (!content)
      return res
        .status(400)
        .json({ success: false, message: "Message cannot be empty." });

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId as string,
        // OR: [
        //   {
        //     memberOneId: {
        //       profileId:user.id
        //     }
        //   },
        //   {
        //     memberTwoId: {
        //       profileId:user.id
        //     }
        //   },
        // ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res
        .status(400)
        .json({ success: false, message: "Conversation not found" });

    const member =
      conversation.memberOne.profileId == user.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member)
      return res
        .status(400)
        .json({ success: false, message: "Member not found" });

        const message = await db.directMessage.create({
          data: {
            content,
            fileUrl: fileUrl ? fileUrl : null,
            memberId: member.id,
            conversationId: conversationId as string,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
        });
        

    const key = `chat:${conversationId}:message`;
    res?.socket?.server?.io?.emit(key, message);

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log("Error while sending message", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default handler;
