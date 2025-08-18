import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;  
      name?: string;
      email?: string;
      image?: string;
    };
  }

  interface JWT {
    id: string;
    username: string;
    role: string;
  }

  interface User {
    id: string;
    username: string;
    role: string;
  }
}
