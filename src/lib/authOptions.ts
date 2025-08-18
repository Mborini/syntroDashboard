import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await pool.connect();
        try {
          const query = `
            SELECT u.id, u.username, u.password, r.name as role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.username = $1
          `;
          const result = await client.query(query, [credentials?.username]);
          if (result.rows.length === 0) return null;
          const user = result.rows[0];
          if (credentials?.password !== user.password) return null;
          return { id: user.id, username: user.username, role: user.role } as any;
        } finally {
          client.release();
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = (user as any).id;
      token.username = (user as any).username;
      token.role = (user as any).role; // ⚡️ مهم
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role = token.role as string; // ⚡️ مهم
    }
    return session;
  },
}

};
