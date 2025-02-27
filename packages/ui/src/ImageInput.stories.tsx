import type { Meta, StoryObj } from "@storybook/react";
import ImageInput from "./ImageInput";

const meta = {
  title: "Common/ImageInput",
  component: ImageInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
  render() {
    return (
      <div>
        <ImageInput size="xl" value={null} onChange={() => {}} />
      </div>
    );
  },
};
