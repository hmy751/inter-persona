import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedInterviewer = async () => {
  try {
    await prisma.interviewer.createMany({
      data: [
        {
          name: '제프 배조스',
          persona: { mbti: 'ISTJ', style: '체계적이고 조직적', focus: '체계적, 구체적' },
        },
        {
          name: '박보영',
          persona: { mbti: 'ENFJ', style: '밝고 다정함', focus: '소통, 공감' },
        },
        {
          name: '백종원',
          persona: { mbti: 'ENTJ', style: '직설적이고 실용적', focus: '문제 해결, 실전 팁' },
        },
        {
          name: '빠더너스',
          persona: { mbti: 'INTP', style: '엉뚱하고 창의적', focus: '창의적 문제 해결' },
        },
      ],
    });

    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedInterviewer();
