import type { Meta, StoryObj } from "@storybook/react";

import { EntryEditor } from "./EntryEditor";

const meta: Meta<typeof EntryEditor> = {
  title: "Atoms/EntryEditor",
  component: EntryEditor,
};

export default meta;
type Story = StoryObj<typeof EntryEditor>;

export const EntryEditorExample: Story = {
  args: {
    defaultEntryKey: "test_entry",
    initialHtmlString: "<p>Test</p>",
    createEntry: () => "test_entry",
    updateEntry: () => true,
    deleteEntry: () => {},
  },
};
