import type { Meta, StoryObj } from "@storybook/react";

import { IpsumEditor } from "./IpsumEditor";

const meta: Meta<typeof IpsumEditor> = {
  title: "Atoms/IpsumEditor",
  component: IpsumEditor,
};

export default meta;
type Story = StoryObj<typeof IpsumEditor>;

export const IpsumEditorExample: Story = {
  args: {
    defaultEntryKey: "test_entry",
    initialHtmlString: "<p>Test</p>",
    createEntry: () => "test_entry",
    updateEntry: () => true,
    deleteEntry: () => {},
  },
};
