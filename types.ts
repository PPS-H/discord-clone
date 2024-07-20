import { Server, Channel, Member, Profile } from "@prisma/client";

type MemberWithProfile = Member & { profile: Profile };

export type ServerWithChannelsWithMembers = Server & {
  members: MemberWithProfile[];
  channels: Channel[];
};
