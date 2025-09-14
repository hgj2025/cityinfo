const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据填充...');

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      nationality: 'US',
      languagePreference: 'en',
      ageGroup: '25-34'
    }
  });

  console.log('创建测试用户:', testUser.email);

  // 创建城市数据
  const cities = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: '东京',
      nameEn: 'Tokyo',
      description: '日本繁华的首都，以现代摩天大楼、传统寺庙和充满活力的文化而闻名。',
      descriptionEn: 'The bustling capital of Japan, known for its modern skyscrapers, traditional temples, and vibrant culture.',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      location: 'Japan'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: '巴黎',
      nameEn: 'Paris',
      description: '光之城，以艺术、时尚、美食和文化而闻名。',
      descriptionEn: 'The City of Light, famous for its art, fashion, gastronomy, and culture.',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
      location: 'France'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: '纽约',
      nameEn: 'New York',
      description: '大苹果，全球金融、艺术、时尚和文化中心。',
      descriptionEn: 'The Big Apple, a global hub for finance, arts, fashion, and culture.',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      location: 'United States'
    }
  ];

  for (const cityData of cities) {
    const city = await prisma.city.upsert({
      where: { id: cityData.id },
      update: {},
      create: cityData
    });
    console.log('创建城市:', city.name);
  }

  console.log('种子数据填充完成!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });