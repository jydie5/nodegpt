import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface SessionUser {
  userId: string;
  username: string;
}

export async function getSession(req: Request): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'secret') as SessionUser;
    return decoded;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
} 