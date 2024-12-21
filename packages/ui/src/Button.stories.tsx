import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta = {
  title: "Common/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    fullWidth: { control: "boolean" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    fullWidth: false,
    isLoading: false,
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
    size: "md",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    isLoading: true,
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div
      style={{
        width: "300px",
        border: "1px solid var(--color-base-black)",
        padding: "var(--space-4)",
      }}
    >
      <Button {...args} />
    </div>
  ),
  args: {
    children: "Full Width",
    fullWidth: true,
  },
};

export const SizeSmall: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const SizeLarge: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};
