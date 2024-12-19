import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 10);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        username,
        password_hash: hashedPassword,
        is_root: false
      }
    });

    return NextResponse.json({
      id: user.id,
      username: user.username
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 