import type { Meta, StoryObj } from "@storybook/react";
import Input from "./Input";
import { useState } from "react";

const meta = {
  title: "Common/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: {
        type: "text",
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    placeholder: "Enter Text...",
  },
  render() {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    return (
      <div>
        <Input
          {...Primary.args}
          isFocused={isFocused}
          isTouched={isTouched}
          onFocusChange={setIsFocused}
          onTouchChange={setIsTouched}
        />
      </div>
    );
  },
};

export const Focused: Story = {
  args: {
    isFocused: true,
    isTouched: true,
    placeholder: "Enter Text...",
  },
};

export const Touched: Story = {
  args: {
    isTouched: true,
    placeholder: "Enter Text...",
  },
};

export const Error: Story = {
  args: {
    isError: "Error",
    placeholder: "Enter Text...",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    placeholder: "Enter Text...",
  },
};
