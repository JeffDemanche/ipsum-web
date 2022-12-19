/* eslint-disable @typescript-eslint/no-var-requires */
import { Modifier as ModifierImport, SelectionState } from "draft-js";
import {
  IpsumEntityData,
  IpsumEntityTransformer,
  IpsumEntityTransformer as IpsumEntityTransformerImport,
} from "util/entities";
import {
  createEditorStateFromFormat as createEditorStateFromFormatImport,
  moveEditorSelectionFromFormat as moveEditorSelectionFromFormatImport,
} from "./editor-utils";

const entityDataForChar = (
  char: number,
  transformer: IpsumEntityTransformer,
  selection: SelectionState
): IpsumEntityData => {
  const charMeta = transformer.getCharacters(selection)[char];
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
      const charData = transformer.getCharacters(initialEditor.getSelection());
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
      const charData = transformer.getCharacters(initialEditor.getSelection());
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
        withOneArc.getCharacters(editorAllSelected.getSelection())[7].char
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

      const chars = withOneArc.getCharacters(editorAllSelected.getSelection());

      expect(chars[10].char).toBe("0");
      expect(chars[10].blockOffset).toBe(2);
    });

    it("gets characters in one block when there are subsequent blocks", () => {
      const initialEditor = createEditorStateFromFormat(
        "<p>0[12]3</p><p>5678</p>"
      );
      const chars = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      ).getCharacters(initialEditor.getSelection());

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
        const charData = transformer.getCharacters(
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
        entityDataForChar(n, withRemovedArcs, editorAllSelected.getSelection());

      expect(arcIds(2)).toBeNull();

      // Ideally this would pass but I'm not seeing an easy way for DraftJS to
      // remove unused entities from the contentState's entityMap.

      // const removedArcsContent = withRemovedArcs.contentState;
      // expect(removedArcsContent.getAllEntities().size).toEqual(0);
    });
  });

  describe("applyEntityData", () => {
    it("does nothing when empty object is supplied", () => {
      const initialEditor = createEditorStateFromFormat("he[ll]o world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const newContent = transformer.applyEntityData(
        initialEditor.getSelection(),
        {}
      ).contentState;

      expect(initialEditor.getCurrentContent()).toEqual(newContent);
    });

    it("can apply two arcAssignments to a selection with not existing entities", () => {
      const initialEditor = createEditorStateFromFormat("he[ll]o world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const newContent = transformer.applyEntityData(
        initialEditor.getSelection(),
        { arcAssignmentIds: ["new assignment 1", "new assignment 2"] }
      ).contentState;

      const entity = newContent.getLastCreatedEntityKey();
      expect(newContent.getEntity(entity).getData()).toEqual({
        arcAssignmentIds: ["new assignment 1", "new assignment 2"],
      });
      expect(newContent.getBlocksAsArray()[0].getEntityAt(1)).toBe(null);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(2)).toBe(entity);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(3)).toBe(entity);
      expect(newContent.getBlocksAsArray()[0].getEntityAt(4)).toBe(null);
    });

    it("does nothing when supplied data is already present for same selection", () => {
      const initialEditor = createEditorStateFromFormat("he[ll]o world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const transformerWithTwoAssgns = transformer.applyEntityData(
        initialEditor.getSelection(),
        { arcAssignmentIds: ["new assignment 1", "new assignment 2"] }
      );

      const newContent = transformerWithTwoAssgns.applyEntityData(
        initialEditor.getSelection(),
        { arcAssignmentIds: ["new assignment 2"] }
      ).contentState;

      expect(transformerWithTwoAssgns.contentState).toEqual(newContent);
    });

    it("applies correct entities for arcAssignment and comment which partially overlap", () => {
      const initialEditor = createEditorStateFromFormat("he[ll]o world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const transformerWithArcAssignment = transformer.applyEntityData(
        initialEditor.getSelection(),
        { arcAssignmentIds: ["new assignment 1"] }
      );
      const editorNewSelection = moveEditorSelectionFromFormat(
        initialEditor,
        "hel[lo] world!"
      );
      const transformerWithComment =
        transformerWithArcAssignment.applyEntityData(
          editorNewSelection.getSelection(),
          { commentIds: ["new comment 1"] }
        );

      const editorAllSelected = moveEditorSelectionFromFormat(
        initialEditor,
        "[hello world!]"
      );

      const entityData = (n: number) =>
        entityDataForChar(
          n,
          transformerWithComment,
          editorAllSelected.getSelection()
        );

      expect(entityData(1)).toBe(null);
      expect(entityData(2)).toEqual({
        arcAssignmentIds: ["new assignment 1"],
      });
      expect(entityData(3)).toEqual({
        arcAssignmentIds: ["new assignment 1"],
        commentIds: ["new comment 1"],
      });
      expect(entityData(4)).toEqual({
        commentIds: ["new comment 1"],
      });
      expect(entityData(5)).toBe(null);
    });
  });

  describe("applyArc (wrapper for applyEntityData)", () => {
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
        const charMeta = withTwoArcs.getCharacters(
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
        entityDataForChar(n, withTwoArcs, editorAllSelected.getSelection());

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
        entityDataForChar(n, withTwoArcs, editorAllSelected.getSelection());

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
        entityDataForChar(n, withTwoArcs, editorAllSelected.getSelection());

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
        entityDataForChar(
          n,
          withConsolidatedArc,
          editorAllSelected.getSelection()
        );

      // Should not include "arc_1" twice
      expect(arcIds(3)).toEqual({ arcIds: ["arc_1"] });
    });
  });

  describe("removeArc", () => {
    it("can remove a single arc in one entity from an entry", () => {
      const editorArc1 = createEditorStateFromFormat(
        "<p>[paragraph 1</p><p>paragraph 2]</p>"
      );
      const withArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      ).applyArc(editorArc1.getSelection(), "arc_1");

      const withArcRemoved = withArc.removeArc("arc_1");

      const arcIds = (n: number) =>
        entityDataForChar(n, withArcRemoved, editorArc1.getSelection());

      expect(arcIds(0)).toEqual(null);
    });

    it("can remove an arc when there are multiple arcs overlapping", () => {
      const editorArc1 = createEditorStateFromFormat(
        "<p>[paragraph 1</p><p>paragraph 2]</p>"
      );
      const editorArc2 = moveEditorSelectionFromFormat(
        editorArc1,
        "<p>p[a]ragraph 1</p><p>paragraph 2</p>"
      );

      const with2Arcs = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      )
        .applyArc(editorArc1.getSelection(), "arc_1")
        .applyArc(editorArc2.getSelection(), "arc_2");

      const withArc1Removed = with2Arcs.removeArc("arc_1");

      const arcIds = (n: number) =>
        entityDataForChar(n, withArc1Removed, editorArc1.getSelection());

      expect(arcIds(0)).toEqual(null);
      expect(arcIds(1)).toEqual({ arcIds: ["arc_2"] });
      expect(arcIds(2)).toEqual(null);
    });

    // it("consolidates equivalent (empty) consecutive entities", () => {
    //   const editorArc1 = createEditorStateFromFormat(
    //     "<p>[p]aragraph 1</p><p>paragraph 2</p>"
    //   );
    //   const editorArc2 = moveEditorSelectionFromFormat(
    //     editorArc1,
    //     "<p>p[a]ragraph 1</p><p>paragraph 2</p>"
    //   );

    //   const withArcs = new IpsumEntityTransformer(
    //     editorArc1.getCurrentContent()
    //   )
    //     .applyArc(editorArc1.getSelection(), "arc_1")
    //     .applyArc(editorArc2.getSelection(), "arc_1");

    //   const withArc1Removed = withArcs.removeArc("arc_1");

    //   const arcIds = (n: number) =>
    //     arcIdsForChar(n, withArc1Removed, editorArc1.getSelection());

    //   const editorArcAllSelected = moveEditorSelectionFromFormat(
    //     editorArc1,
    //     "<p>[paragraph 1</p><p>paragraph 2]</p>"
    //   );

    //   const char1EntityId = withArc1Removed.getSelectedCharacters(
    //     editorArcAllSelected.getSelection()
    //   )[0].entityId;
    //   const char2EntityId = withArc1Removed.getSelectedCharacters(
    //     editorArcAllSelected.getSelection()
    //   )[1].entityId;
    //   expect(char);
    // });
  });

  describe("getAppliedArcs", () => {
    it("gets the correct arcs, including when one was removed", () => {
      const editor0Selected = createEditorStateFromFormat(
        "<p>[0]1234567890</p>"
      );
      const editor1Selected = moveEditorSelectionFromFormat(
        editor0Selected,
        "<p>0[1]234567890</p>"
      );
      const editor2Selected = moveEditorSelectionFromFormat(
        editor1Selected,
        "<p>01[2]34567890</p>"
      );

      const editor3ArcsApplied1Removed = new IpsumEntityTransformer(
        editor0Selected.getCurrentContent()
      )
        .applyArc(editor0Selected.getSelection(), "arc_0_1")
        .applyArc(editor0Selected.getSelection(), "arc_0_2")
        .applyArc(editor1Selected.getSelection(), "arc_1")
        .applyArc(editor2Selected.getSelection(), "arc_2")
        .removeArc("arc_1");

      expect(editor3ArcsApplied1Removed.getAppliedArcs()).toEqual([
        "arc_0_1",
        "arc_0_2",
        "arc_2",
      ]);
    });
  });

  describe("consolidateEntities", () => {});
});
