import { db } from "./db";

export const getOrCreateConvesation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  const conversation = await db.conversation.findFirst({
    where: {
      memberOneId,
      memberTwoId,
    },
  });
  if (!conversation) return null;
  return conversation;
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  const conversation = await db.conversation.create({
    data: {
      memberOneId,
      memberTwoId,
    },
  });

  return conversation;
};
