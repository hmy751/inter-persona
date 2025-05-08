import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedInterviewer = async () => {
  try {
    await prisma.interviewer.createMany({
      data: [
        {
          name: '제프 배조스',
          persona: { mbti: 'ISTJ', style: '체계적이고 조직적', focus: '체계적, 구체적' },
          profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ISTJ.png',
          description:
            '제프 배조스는 체계적이고 조직적인 스타일을 갖췄습니다. ISTJ 성격답게 꼼꼼하고 논리적인 질문을 통해 지원자의 세부 사항을 집중적으로 살펴봅니다.',
        },
        {
          name: '박보영',
          persona: { mbti: 'ENFJ', style: '밝고 다정함', focus: '소통, 공감' },
          profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ENFJ.png',
          description:
            '박보영은 밝고 다정한 성격을 지녔습니다. ENFJ 성격을 살려 따뜻한 면접 분위기를 조성하며, 소통과 팀워크를 중시하는 질문을 제시합니다.',
        },
        {
          name: '백종원',
          persona: { mbti: 'ENTJ', style: '직설적이고 실용적', focus: '문제 해결, 실전 팁' },
          profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/ENTJ.png',
          description:
            '백종원은 직설적이고 실용적인 성격을 갖췄습니다. ENTJ 스타일로 실전적인 질문을 통해 지원자의 문제 해결 능력과 활용 가능한 팁을 중점적으로 평가합니다.',
        },
        {
          name: '빠더너스',
          persona: { mbti: 'INTP', style: '엉뚱하고 창의적', focus: '창의적 문제 해결' },
          profileImageUrl: 'https://inter-persona.s3.ap-northeast-2.amazonaws.com/profile-images/INTP.png',
          description:
            '빠더너스는 엉뚱하고 창의적인 성격을 지녔습니다. INTP 성격답게 독특한 질문을 통해 지원자의 창의적 문제 해결 능력을 평가합니다.',
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
