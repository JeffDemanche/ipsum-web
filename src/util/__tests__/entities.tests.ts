/* eslint-disable @typescript-eslint/no-var-requires */
import { Modifier as ModifierImport, SelectionState } from "draft-js";
import {
  IpsumEntityTransformer,
  IpsumEntityTransformer as IpsumEntityTransformerImport,
} from "util/entities";
import {
  createEditorStateFromFormat as createEditorStateFromFormatImport,
  moveEditorSelectionFromFormat as moveEditorSelectionFromFormatImport,
} from "./editor-utils";

const arcIdsForChar = (
  char: number,
  transformer: IpsumEntityTransformer,
  selection: SelectionState
): unknown => {
  const charMeta = transformer.getSelectedCharacters(selection)[char];
  if (charMeta.entityId === null) return null;
  return transformer.contentState.getEntity(charMeta.entityId).getData();
};

describe("entities", () => {
  // DraftJS caches data about entities at the module-level, so this setup just
  // ensures that each test runs in a clean environment.

  let Modifier: typeof ModifierImport = require("draft-js").Modifier;
  let IpsumEntityTransformer: typeof IpsumEntityTransformerImport =
    require("util/entities").IpsumEntityTransformer;
  let createEditorStateFromFormat: typeof createEditorStateFromFormatImport =
    require("./editor-utils").createEditorStateFromFormat;
  let moveEditorSelectionFromFormat: typeof moveEditorSelectionFromFormatImport =
    require("./editor-utils").moveEditorSelectionFromFormat;

  beforeEach(() => {
    jest.resetModules();
    Modifier = require("draft-js").Modifier;
    IpsumEntityTransformer = require("util/entities").IpsumEntityTransformer;
    createEditorStateFromFormat =
      require("./editor-utils").createEditorStateFromFormat;
    moveEditorSelectionFromFormat =
      require("./editor-utils").moveEditorSelectionFromFormat;
  });

  describe("getSelectedCharacters", () => {
    it("for a single block with no entities 1", () => {
      const initialEditor = createEditorStateFromFormat("[hello] world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const charData = transformer.getSelectedCharacters(
        initialEditor.getSelection()
      );
      expect(charData.length).toBe(5);
      expect(charData[0]).toEqual({
        char: "h",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
        blockOffset: 0,
        entityId: null,
      });
      expect(charData[4]).toEqual({
        char: "o",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
        blockOffset: 4,
        entityId: null,
      });
    });

    it("for a single block with no entities 2", () => {
      const initialEditor = createEditorStateFromFormat("h[ello world!]");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const charData = transformer.getSelectedCharacters(
        initialEditor.getSelection()
      );
      expect(charData.length).toBe(11);
      expect(charData[0]).toEqual({
        char: "e",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
        blockOffset: 1,
        entityId: null,
      });
      expect(charData[4]).toEqual({
        char: " ",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
        blockOffset: 5,
        entityId: null,
      });
      expect(charData[10]).toEqual({
        char: "!",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
        blockOffset: 11,
        entityId: null,
      });
    });

    it("gets characters in first two blocks across three total", () => {
      const editorArc1 = createEditorStateFromFormat(
        "<p>01[23</p><p>4567]</p><p>8901</p>"
      );
      const withOneArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      );

      const editorAllSelected = moveEditorSelectionFromFormat(
        editorArc1,
        "<p>[0123</p><p>4567</p><p>8901]</p>"
      );

      expect(
        withOneArc.getSelectedCharacters(editorAllSelected.getSelection())[7]
          .char
      ).toBe("7");
    });

    it("gets characters in last two blocks across three total", () => {
      const editorArc1 = createEditorStateFromFormat(
        "<p>0123</p><p>45[67</p><p>890]1</p>"
      );
      const withOneArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      );

      const editorAllSelected = moveEditorSelectionFromFormat(
        editorArc1,
        "<p>[0123</p><p>4567</p><p>8901]</p>"
      );

      const chars = withOneArc.getSelectedCharacters(
        editorAllSelected.getSelection()
      );

      expect(chars[10].char).toBe("0");
      expect(chars[10].blockOffset).toBe(2);
    });

    it("gets characters in one block when there are subsequent blocks", () => {
      const initialEditor = createEditorStateFromFormat(
        "<p>0[12]3</p><p>5678</p>"
      );
      const chars = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      ).getSelectedCharacters(initialEditor.getSelection());

      expect(chars.length).toBe(2);
      expect(chars[0].char).toBe("1");
      expect(chars[1].char).toBe("2");
    });

    it.each`
      entityString                         | selectionString                      | expected
      ${"hello [world!]"}                  | ${"hell[o wor]ld!"}                  | ${{ 0: { char: "o", entity: false }, 2: { char: "w", entity: true } }}
      ${"<p>hell[o</p><p>w]orld!</p>"}     | ${"<p>hel[lo</p><p>wo]rld!<p>"}      | ${{ 0: { char: "l", entity: false }, 1: { char: "o", entity: true }, 2: { char: "w", entity: true } }}
      ${"<p>1 [2/p><p>3 4</p><p>5] 6</p>"} | ${"<p>1[ 2/p><p>3 4</p><p>5 ]6</p>"} | ${{ 0: { char: " ", entity: false }, 1: { char: "2", entity: true } }}
    `(
      "gets correct character data for string with entity $entityString and selection $selectionString",
      ({ entityString, selectionString, expected }) => {
        const initialEditor = createEditorStateFromFormat(entityString);
        const contentStateWithEntity = initialEditor
          .getCurrentContent()
          .createEntity("ARC", "MUTABLE", "test");

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const contentStateWithArc = Modifier.applyEntity(
          contentStateWithEntity,
          initialEditor.getSelection(),
          entityKey
        );
        const transformer = new IpsumEntityTransformer(contentStateWithArc);
        const newSelectionEditor = moveEditorSelectionFromFormat(
          initialEditor,
          selectionString
        );
        const charData = transformer.getSelectedCharacters(
          newSelectionEditor.getSelection()
        );

        Object.keys(expected).forEach((k) => {
          expect(charData[Number.parseInt(k)].char).toEqual(expected[k].char);
          if (expected[k].entity)
            expect(charData[Number.parseInt(k)].entityId).toBeDefined();
          else expect(charData[Number.parseInt(k)].entityId).toBeNull();
        });
      }
    );
  });

  describe("clearEntities", () => {
    it("clears a single arc from an editor state with a single block", () => {
      const initialEditor = createEditorStateFromFormat("he[ll]o world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const withArc = transformer.applyArc(
        initialEditor.getSelection(),
        "test_arc_id"
      );

      const editorAllSelected = moveEditorSelectionFromFormat(
        initialEditor,
        "[hello world!]"
      );

      const withRemovedArcs = withArc.clearEntities();

      const arcIds = (n: number) =>
        arcIdsForChar(n, withRemovedArcs, editorAllSelected.getSelection());

      expect(arcIds(2)).toBeNull();

      // Ideally this would pass but I'm not seeing an easy way for DraftJS to
      // remove unused entities from the contentState's entityMap.

      // const removedArcsContent = withRemovedArcs.contentState;
      // expect(removedArcsContent.getAllEntities().size).toEqual(0);
    });
  });

  describe("applyArc", () => {
    it("can apply an entity for a single arc", () => {
      const initialEditor = createEditorStateFromFormat("he[ll]o world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const newContent = transformer.applyArc(
        initialEditor.getSelection(),
        "test_arc_id"
      ).contentState;

      const entity = newContent.getLastCreatedEntityKey();
      expect(newContent.getEntity(entity).getData()).toEqual({
        arcIds: ["test_arc_id"],
      });
      expect(newContent.getBlocksAsArray()[0].getEntityAt(1)).toBe(null);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(2)).toBe(entity);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(3)).toBe(entity);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(4)).toBe(null);
    });

    it("can apply an arc across blocks", () => {
      const initialEditor = createEditorStateFromFormat(
        "<p>012[34</p><p>01]23</p>"
      );
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const newContent = transformer.applyArc(
        initialEditor.getSelection(),
        "test_arc_id"
      ).contentState;

      expect(newContent.getAllEntities().size).toBe(1);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(2)).toBe(null);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(3)).not.toBe(null);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(4)).not.toBe(null);
      expect(newContent.getBlocksAsArray()[1].getEntityAt(0)).not.toBe(null);
      expect(newContent.getBlocksAsArray()[1].getEntityAt(1)).not.toBe(null);
      expect(newContent.getBlocksAsArray()[1].getEntityAt(2)).toBe(null);
    });

    it("can apply overlapping arcs where arc 2 is completely inside arc 1", () => {
      const editorArc1 = createEditorStateFromFormat("[hello world!]");
      const withOneArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      ).applyArc(editorArc1.getSelection(), "arc_1");

      const editorArc2 = moveEditorSelectionFromFormat(
        editorArc1,
        "[hello] world!"
      );
      const withTwoArcs = new IpsumEntityTransformer(
        withOneArc.contentState
      ).applyArc(editorArc2.getSelection(), "arc_2");

      const editorAllSelected = moveEditorSelectionFromFormat(
        editorArc2,
        "[hello world!]"
      );

      const arcIdsForChar = (char: number): unknown => {
        const charMeta = withTwoArcs.getSelectedCharacters(
          editorAllSelected.getSelection()
        )[char];
        return withTwoArcs.contentState.getEntity(charMeta.entityId).getData();
      };

      expect(withTwoArcs.contentState.getAllEntities().count()).toBe(2);
      expect(arcIdsForChar(0)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIdsForChar(3)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIdsForChar(4)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIdsForChar(5)).toEqual({ arcIds: ["arc_1"] });
      expect(arcIdsForChar(11)).toEqual({ arcIds: ["arc_1"] });
    });

    it("can apply overlapping arcs where arc 2 is partially inside arc 1", () => {
      const editorArc1 = createEditorStateFromFormat("h[el]lo world!");
      const withOneArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      ).applyArc(editorArc1.getSelection(), "arc_1");

      const editorArc2 = moveEditorSelectionFromFormat(
        editorArc1,
        "he[ll]o world!"
      );
      const withTwoArcs = new IpsumEntityTransformer(
        withOneArc.contentState
      ).applyArc(editorArc2.getSelection(), "arc_2");

      const editorAllSelected = moveEditorSelectionFromFormat(
        editorArc2,
        "[hello world!]"
      );

      const arcIds = (n: number) =>
        arcIdsForChar(n, withTwoArcs, editorAllSelected.getSelection());

      expect(withTwoArcs.contentState.getAllEntities().count()).toBe(3);
      // h[e(l]l)o world!
      expect(arcIds(0)).toBeNull();
      expect(arcIds(1)).toEqual({ arcIds: ["arc_1"] });
      expect(arcIds(2)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(3)).toEqual({ arcIds: ["arc_2"] });
      expect(arcIds(4)).toBeNull();
    });

    it("can apply two arcs across multiple blocks", () => {
      const editorArc1 = createEditorStateFromFormat(
        "<p>01[23</p><p>4567</p><p>89]01</p>"
      );
      const withOneArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      ).applyArc(editorArc1.getSelection(), "arc_1");

      const editorArc2 = moveEditorSelectionFromFormat(
        editorArc1,
        "<p>0123</p><p>45[67</p><p>890]1</p>"
      );
      const withTwoArcs = new IpsumEntityTransformer(
        withOneArc.contentState
      ).applyArc(editorArc2.getSelection(), "arc_2");

      const editorAllSelected = moveEditorSelectionFromFormat(
        editorArc2,
        "<p>[0123</p><p>4567</p><p>8901]</p>"
      );

      const arcIds = (n: number) =>
        arcIdsForChar(n, withTwoArcs, editorAllSelected.getSelection());

      expect(withTwoArcs.contentState.getAllEntities().count()).toBe(3);
      expect(arcIds(0)).toBeNull();
      expect(arcIds(2)).toEqual({ arcIds: ["arc_1"] });
      expect(arcIds(5)).toEqual({ arcIds: ["arc_1"] });
      expect(arcIds(6)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(7)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(8)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(9)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(10)).toEqual({ arcIds: ["arc_2"] });
      expect(arcIds(11)).toBeNull();
    });

    it("can apply two arcs that overlap exactly", () => {
      const editorArc1 = createEditorStateFromFormat(
        "<p>01[23</p><p>4567</p><p>89]01</p>"
      );
      const withOneArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      ).applyArc(editorArc1.getSelection(), "arc_1");

      const editorArc2 = moveEditorSelectionFromFormat(
        editorArc1,
        "<p>01[23</p><p>4567</p><p>89]01</p>"
      );
      const withTwoArcs = new IpsumEntityTransformer(
        withOneArc.contentState
      ).applyArc(editorArc2.getSelection(), "arc_2");

      const editorAllSelected = moveEditorSelectionFromFormat(
        editorArc2,
        "<p>[0123</p><p>4567</p><p>8901]</p>"
      );

      const arcIds = (n: number) =>
        arcIdsForChar(n, withTwoArcs, editorAllSelected.getSelection());

      expect(withTwoArcs.contentState.getAllEntities().count()).toBe(2);
      expect(arcIds(0)).toBeNull();
      expect(arcIds(2)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(5)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(6)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(7)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(8)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(9)).toEqual({ arcIds: ["arc_1", "arc_2"] });
      expect(arcIds(10)).toBeNull();
    });

    it("applying the same arc overlapped combines the entities", () => {
      const editorArc1 = createEditorStateFromFormat("0[123]456789");

      const withArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      ).applyArc(editorArc1.getSelection(), "arc_1");

      const editorArc2 = moveEditorSelectionFromFormat(
        editorArc1,
        "012[345]6789"
      );
      const withConsolidatedArc = withArc.applyArc(
        editorArc2.getSelection(),
        "arc_1"
      );

      const editorAllSelected = moveEditorSelectionFromFormat(
        editorArc1,
        "[0123456789]"
      );

      const arcIds = (n: number) =>
        arcIdsForChar(n, withConsolidatedArc, editorAllSelected.getSelection());

      // Should not include "arc_1" twice
      expect(arcIds(3)).toEqual({ arcIds: ["arc_1"] });
    });
  });
});
