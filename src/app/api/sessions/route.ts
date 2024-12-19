import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// セッション一覧の取得
export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: { user_id: session.userId },
      orderBy: { start_time: 'desc' },
      include: { messages: true }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// 新しいセッションの作成
export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newSession = await prisma.session.create({
      data: {
        user_id: session.userId,
        total_tokens: 0
      }
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
} 