import { Server, Channel, Member, Profile } from "@prisma/client";
import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

type MemberWithProfile = Member & { profile: Profile };

export type ServerWithChannelsWithMembers = Server & {
  members: MemberWithProfile[];
  channels: Channel[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
