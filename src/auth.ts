import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const DEMO_PERSONAS = [
  {
    id: 'user_elena_vance',
    email: 'elena@vancestudio.design',
    name: 'Elena Vance',
    role: 'Brand & Product Designer',
    businessName: 'Vance Studio Design LLC',
    currency: 'USD',
    country: 'US',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    description: 'US Solopreneur • Single LLC • $140k/yr • 28% Withholding',
  },
  {
    id: 'user_arjun_mehta',
    email: 'arjun@mehtasystems.dev',
    name: 'Arjun Mehta',
    role: 'Senior Fullstack Contractor',
    businessName: 'Mehta Systems Tech Services',
    currency: 'INR',
    country: 'IN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    description: 'India Contractor • Sec 44ADA • ₹60L/yr • 15% Withholding',
  },
  {
    id: 'user_chloe_lin',
    email: 'chloe@chloelin.studio',
    name: 'Chloe Lin',
    role: 'Creator & Educator',
    businessName: 'Chloe Lin Media LLC',
    currency: 'USD',
    country: 'US',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    description: 'US Creator • Multi-Stream Income • $95k/yr • 25% Withholding',
  },
  {
    id: 'user_pioneer_labs',
    email: 'david@pioneerlabs.dev',
    name: 'David Chen',
    role: 'Micro-SaaS Founder',
    businessName: 'Pioneer Labs Inc',
    currency: 'USD',
    country: 'US',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    description: 'US Micro-Startup • 2-Person S-Corp • $260k/yr • 32% Withholding',
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'SoloFi Demo Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        personaId: { label: 'Persona ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const email = credentials.email as string | undefined;
        const personaId = credentials.personaId as string | undefined;

        // Find matching persona
        const persona = DEMO_PERSONAS.find(
          (p) => (email && p.email.toLowerCase() === email.toLowerCase()) || (personaId && p.id === personaId)
        );

        if (persona) {
          return {
            id: persona.id,
            name: persona.name,
            email: persona.email,
            image: persona.avatar,
            role: persona.role,
            country: persona.country,
            currency: persona.currency,
          };
        }

        // Fallback demo user for custom emails
        return {
          id: 'user_elena_vance',
          name: 'Elena Vance',
          email: email || 'elena@vancestudio.design',
          image: DEMO_PERSONAS[0].avatar,
          role: 'Brand & Product Designer',
          country: 'US',
          currency: 'USD',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role;
        token.country = (user as unknown as { country?: string }).country;
        token.currency = (user as unknown as { currency?: string }).currency;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role?: string }).role = token.role as string;
        (session.user as unknown as { country?: string }).country = token.country as string;
        (session.user as unknown as { currency?: string }).currency = token.currency as string;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET || 'solofi_super_secret_session_key_2025_fintech_production',
});
