import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectRoot, SelectOption } from './Select';
import type { ComponentProps } from 'react';

type SelectRootProps = ComponentProps<typeof SelectRoot>;

const meta = {
  title: 'Common/Select',
  component: SelectRoot,
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
      <SelectRoot {...args} value={value} onValueChange={setValue}>
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2">Option 2</SelectOption>
        <SelectOption value="option3">Option 3</SelectOption>
      </SelectRoot>
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
      <SelectRoot {...args} value={value} onValueChange={setValue}>
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2">Option 2 (Initial)</SelectOption>
        <SelectOption value="option3">Option 3</SelectOption>
      </SelectRoot>
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
      <SelectRoot {...args} value={value} onValueChange={setValue}>
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2">Option 2</SelectOption>
      </SelectRoot>
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
      <SelectRoot {...args} value={value} onValueChange={setValue}>
        <SelectOption value="option1">Option 1 (Disabled Select)</SelectOption>
        <SelectOption value="option2">Option 2</SelectOption>
      </SelectRoot>
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
      <SelectRoot {...args} value={value} onValueChange={setValue}>
        <SelectOption value="option1">Option 1</SelectOption>
        <SelectOption value="option2" disabled>
          Option 2 (Disabled)
        </SelectOption>
        <SelectOption value="option3">Option 3</SelectOption>
      </SelectRoot>
    );
  },
  args: {
    placeholder: 'Select with disabled option...',
  },
};
