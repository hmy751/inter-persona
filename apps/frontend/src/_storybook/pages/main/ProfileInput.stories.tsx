import type { Meta } from '@storybook/react';
import ProfileInput from '@/_components/pages/main/ProfileInput';

const meta: Meta<typeof ProfileInput> = {
  title: 'Pages/Main/ProfileInput',
  component: ProfileInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Primary = {
  render() {
    return (
      <div>
        <ProfileInput size="xl" setImage={() => {}} />
      </div>
    );
  },
};
