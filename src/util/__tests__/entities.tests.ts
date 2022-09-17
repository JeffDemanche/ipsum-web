import { Modifier } from "draft-js";
import { IpsumEntityTransformer } from "util/entities";
import {
  createEditorStateFromFormat,
  moveEditorSelectionFromFormat,
} from "./editor-state.tests";

describe("entities", () => {
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
        entityId: null,
      });
      expect(charData[4]).toEqual({
        char: "o",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
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
        entityId: null,
      });
      expect(charData[4]).toEqual({
        char: " ",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
        entityId: null,
      });
      expect(charData[10]).toEqual({
        char: "!",
        block: initialEditor.getCurrentContent().getBlocksAsArray()[0].getKey(),
        entityId: null,
      });
    });

    it.each`
      entityString                     | selectionString                 | expected
      ${"hello [world!]"}              | ${"hell[o wor]ld!"}             | ${{ 0: { char: "o", entity: false }, 2: { char: "w", entity: true } }}
      ${"<p>hell[o</p><p>w]orld!</p>"} | ${"<p>hel[lo</p><p>wo]rld!<p>"} | ${{ 0: { char: "l", entity: false }, 1: { char: "o", entity: true }, 2: { char: "w", entity: true } }}
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

  describe("applyArc", () => {
    it.skip("transforms an editor state to apply an entity for a single arc", () => {
      const initialEditor = createEditorStateFromFormat("[hello] world!");
      const transformer = new IpsumEntityTransformer(
        initialEditor.getCurrentContent()
      );
      const newContent = transformer.applyArc(
        initialEditor.getSelection(),
        "test_arc_id"
      ).contentState;

      const entity = newContent.getAllEntities().keys().next();
      expect(newContent.getEntity(entity.value).getData()).toEqual({
        arcId: "test_arc_id",
      });
      expect(newContent.getBlocksAsArray()[0].getEntityAt(0)).toBe(
        entity.value
      );
      expect(newContent.getBlocksAsArray()[0].getEntityAt(4)).toBe(
        entity.value
      );
      expect(newContent.getBlocksAsArray()[0].getEntityAt(5)).toBe(null);
    });

    it.skip("can assign an arc to content that already has an arc assigned", () => {
      const editorArc1 = createEditorStateFromFormat("[hello world!]");
      const withOneArc = new IpsumEntityTransformer(
        editorArc1.getCurrentContent()
      ).applyArc(editorArc1.getSelection(), "arc_1").contentState;

      const editorArc2 = moveEditorSelectionFromFormat(
        editorArc1,
        "[hello] world!"
      );
      // "[hello] world!"
      const withTwoArcs = new IpsumEntityTransformer(
        editorArc2.getCurrentContent()
      ).applyArc(editorArc2.getSelection(), "arc_2").contentState;

      expect(withTwoArcs.getAllEntities().count()).toBe(2);

      const entityChar1 = withTwoArcs.getBlocksAsArray()[0].getEntityAt(0);
      expect(withTwoArcs.getEntity(entityChar1).getData()).toBe({
        arcIds: ["arc_1", "arc_2"],
      });

      const entityChar4 = withTwoArcs.getBlocksAsArray()[0].getEntityAt(0);
      expect(withTwoArcs.getEntity(entityChar4).getData()).toBe({
        arcIds: ["arc_1", "arc_2"],
      });

      const entityChar5 = withTwoArcs.getBlocksAsArray()[0].getEntityAt(0);
      expect(withTwoArcs.getEntity(entityChar5).getData()).toBe({
        arcIds: ["arc_1"],
      });
    });
  });
});
