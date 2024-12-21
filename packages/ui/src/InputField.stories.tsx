import type { Meta, StoryObj } from "@storybook/react";
import InputField from "./InputField";
import Input from "./Input";
import { useState } from "react";
const meta = {
  title: "Common/InputField",
  component: InputField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Email",
    children: <Input placeholder="Enter Text..." />,
  },
  render() {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    return (
      <div>
        <InputField {...Primary.args} elementHeight="var(--space-10)">
          <Input
            placeholder="Enter Text..."
            isFocused={isFocused}
            isTouched={isTouched}
            onFocusChange={setIsFocused}
            onTouchChange={setIsTouched}
          />
        </InputField>
      </div>
    );
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    children: <Input placeholder="Enter Text..." />,
    message: "Please enter a valid email address",
  },
  render() {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errorMessage, setErrorMessage] = useState(
      "Please enter a valid email address"
    );

    return (
      <div>
        <InputField {...Error.args} elementHeight="var(--space-10)">
          <Input
            placeholder="Enter Text..."
            isFocused={isFocused}
            isTouched={isTouched}
            onFocusChange={setIsFocused}
            onTouchChange={setIsTouched}
            isError={errorMessage}
          />
        </InputField>
      </div>
    );
  },
};
