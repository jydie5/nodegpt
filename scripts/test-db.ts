import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // データベース接続テスト
    const result = await prisma.$queryRaw`SELECT 1+1 as result`
    console.log('Database connection successful:', result)

    // テストユーザーの作成
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password_hash: 'test123',
        is_root: true
      }
    })
    console.log('Test user created:', user)

  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 