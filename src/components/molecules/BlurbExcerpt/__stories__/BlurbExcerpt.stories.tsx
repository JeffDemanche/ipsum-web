import type { Meta, StoryObj } from "@storybook/react";

import { BlurbExcerpt } from "../BlurbExcerpt";

const meta: Meta<typeof BlurbExcerpt> = {
  title: "Molecules/BlurbExcerpt",
  component: BlurbExcerpt,
};

export default meta;
type Story = StoryObj<typeof BlurbExcerpt>;

export const BlurbExcerptExample: Story = {
  args: {
    highlightId: "highlight-id",
    highlightHue: 0,
    showAll: false,
    allowContext: true,
    maxLines: 0,
    htmlString: "<p>This is a blurb excerpt.</p>",
  },
};

export const BlurbExcerptWithHighlight: Story = {
  args: {
    highlightId: "highlight-id",
    highlightHue: 0,
    showAll: false,
    allowContext: true,
    maxLines: 0,
    htmlString: `
      <p class="EditorStyles__editor-paragraph___yyLoR" dir="ltr"><span data-lexical-text="true">This is a blurb excerpt.</span></p>
      <p class="EditorStyles__editor-paragraph___yyLoR" dir="ltr"><span data-highlight-id="highlight-id" class="HighlightAssignmentPlugin__highlight___ztR5x" data-hue="180" dir="ltr" style="--hue: 184; --lightness: 50%;"><span data-lexical-text="true">This is the second paragraph, which is tagged with a highlight with ID "highlight-id" and a CSS var --hue: 180.</span></span></p>
      <p class="EditorStyles__editor-paragraph___yyLoR" dir="ltr"><span data-highlight-id="highlight-id" class="HighlightAssignmentPlugin__highlight___ztR5x" data-hue="180" dir="ltr" style="--hue: 184; --lightness: 50%;"><span data-lexical-text="true">This is another tagged paragraph.</span></span></p>
      <p class="EditorStyles__editor-paragraph___yyLoR" dir="ltr"><span data-lexical-text="true">This is text that comes after the tagged paragraphs.</span></p></div>
      `,
  },
};
