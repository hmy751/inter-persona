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
    placeholder: "Enter Text...",
  },
  render() {
    const [isTouched, setIsTouched] = useState(true);
    const [isFocused, setIsFocused] = useState(true);
    return (
      <div>
        <Input
          placeholder="Enter Text..."
          isFocused={isFocused}
          isTouched={isTouched}
          onFocusChange={setIsFocused}
          onTouchChange={setIsTouched}
        />
      </div>
    );
  },
};

export const Touched: Story = {
  args: {
    placeholder: "Enter Text...",
  },
  render() {
    const [isTouched, setIsTouched] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    return (
      <div>
        <Input
          placeholder="Enter Text..."
          isTouched={isTouched}
          isFocused={isFocused}
          onTouchChange={setIsTouched}
          onFocusChange={setIsFocused}
        />
      </div>
    );
  },
};

export const Error: Story = {
  args: {
    placeholder: "Enter Text...",
  },
  render() {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error");
    return (
      <div>
        <Input
          placeholder="Enter Text..."
          isFocused={isFocused}
          isTouched={isTouched}
          onFocusChange={setIsFocused}
          onTouchChange={setIsTouched}
          isError={errorMessage}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Enter Text...",
  },
  render() {
    const [isTouched, setIsTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    return (
      <div>
        <Input
          placeholder="Enter Text..."
          isDisabled={true}
          isTouched={isTouched}
          isFocused={isFocused}
        />
      </div>
    );
  },
};
