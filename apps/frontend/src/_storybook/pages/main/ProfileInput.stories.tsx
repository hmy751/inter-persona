import type { Meta, StoryObj } from '@storybook/react';
import ProfileInput from '@/_components/pages/main/ProfileInput';

const meta = {
  title: 'Pages/Main/ProfileInput',
  component: ProfileInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
  render() {
    return (
      <div>
        <ProfileInput size="xl" setImage={() => {}} />
      </div>
    );
  },
};
