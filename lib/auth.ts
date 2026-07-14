import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import prisma from './db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash || !user.emailVerified) return null;

        const match = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!match) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
  async signIn({ user, account }: any) {
    if (account?.provider === 'google') {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name },
          create: {
            email: user.email,
            name: user.name || '',
            emailVerified: true,
          },
        });
      } catch (error) {
        console.error('❌ User creation failed:', error);
      }
    }
    return true;
  },
  async jwt({ token, user }: any) {
    if (user) {
      token.role = user.role;
    } else if (token.sub) {
      // Fetch role from DB on subsequent calls
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { role: true },
      });
      token.role = dbUser?.role || 'user';
    }
    return token;
  },
  async session({ session, token }: any) {
    if (session.user) {
      session.user.id = token.sub;
      session.user.role = token.role;
    }
    return session;
  },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});
