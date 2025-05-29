import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';
import type { ComponentProps } from 'react';

type SelectRootProps = ComponentProps<typeof Select>;

const meta = {
  title: 'Common/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    isError: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<SelectRootProps>;

export default meta;

type Story = StoryObj<SelectRootProps>;

export const Primary: Story = {
  render: args => {
    const [value, setValue] = useState('');

    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <Select.Option value="option1">Option 1</Select.Option>
        <Select.Option value="option2">Option 2</Select.Option>
        <Select.Option value="option3">Option 3</Select.Option>
      </Select>
    );
  },
  args: {
    placeholder: 'Select an option...',
  },
};

export const InitialValue: Story = {
  render: args => {
    const [value, setValue] = useState('option2');

    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <Select.Option value="option1">Option 1</Select.Option>
        <Select.Option value="option2">Option 2 (Initial)</Select.Option>
        <Select.Option value="option3">Option 3</Select.Option>
      </Select>
    );
  },
  args: {
    placeholder: 'Select an option...',
  },
};

export const Error: Story = {
  render: args => {
    const [value, setValue] = useState('');

    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <Select.Option value="option1">Option 1</Select.Option>
        <Select.Option value="option2">Option 2</Select.Option>
      </Select>
    );
  },
  args: {
    placeholder: 'Select with error...',
    isError: 'This field is required.',
  },
};

export const Disabled: Story = {
  render: args => {
    const [value, setValue] = useState('option1');

    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <Select.Option value="option1">Option 1 (Disabled Select)</Select.Option>
        <Select.Option value="option2">Option 2</Select.Option>
      </Select>
    );
  },
  args: {
    placeholder: 'Disabled Select...',
    disabled: true,
  },
};

export const WithDisabledOption: Story = {
  render: args => {
    const [value, setValue] = useState('');

    return (
      <Select {...args} value={value} onValueChange={setValue}>
        <Select.Option value="option1">Option 1</Select.Option>
        <Select.Option value="option2" disabled>
          Option 2 (Disabled)
        </Select.Option>
        <Select.Option value="option3">Option 3</Select.Option>
      </Select>
    );
  },
  args: {
    placeholder: 'Select with disabled option...',
  },
};
