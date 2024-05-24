import { BlockType } from "components/atoms/EntryEditor";

interface ExcerptPiece {
  blockType: BlockType;
  innerHtml: string;
  highlight?: {
    id: string;
    hue: number;
  };
}

interface ConstructExcerptArgs {
  excerptPieces: ExcerptPiece[];
}

const blockTypeToTagMap: Record<BlockType, string> = {
  ["paragraph"]: "p",
  ["h1"]: "h1",
  ["h2"]: "h2",
  ["ul"]: "ul",
  ["ol"]: "ol",
  ["quote"]: "blockquote",
};

const constructExcerptPiece = (piece: ExcerptPiece): string => {
  const innerHtmlWrapper = `<span data-lexical-text="true">${piece.innerHtml}</span>`;

  const highlightWrapper = piece.highlight
    ? `<span data-highlight-id="${piece.highlight.id}" class="ipsum-highlight" data-hue="${piece.highlight.hue}" dir="ltr" style="--hue: ${piece.highlight.hue}; --lightness: 50%;">${innerHtmlWrapper}</span>`
    : innerHtmlWrapper;

  return `<${blockTypeToTagMap[piece.blockType]}>${highlightWrapper}</${blockTypeToTagMap[piece.blockType]}>`;
};

export const constructExcerpt = (args: ConstructExcerptArgs): string => {
  return args.excerptPieces.map(constructExcerptPiece).join("");
};
