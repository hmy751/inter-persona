import type { Meta, StoryObj } from '@storybook/react';
import InterviewerCard from '@/_components/pages/interviewer/InterviewerCard';

const meta = {
  title: 'Pages/Interviewer/InterviewerCard',
  component: InterviewerCard,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        back: () => {
          // console.log('Back button clicked');
        },
        push: () => {
          // console.log('Router push called');
        },
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    imgUrl: { control: 'text' },
    name: { control: 'text' },
    mbti: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof InterviewerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    id: 1,
    imgUrl: '/images/ENFP.webp',
    name: '민지',
    mbti: 'ENFP',
    description:
      '이론 중심의 면접을 진행합니다. 컴퓨터 과학(CS) 개념과 프레임워크의 운영 원리에 관한 질문을 강조합니다.',
  },
  render: args => (
    <div
      style={{
        width: '600px',
        height: '400px',
        padding: '20px',
        border: '1px solid #e0e0e0',
      }}
    >
      <InterviewerCard {...args} />
    </div>
  ),
};

export const InMobile: Story = {
  args: {
    ...Primary.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};
