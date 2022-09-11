import { IpsumEntityTransformer } from "util/entities";
import { createEditorStateFromFormat } from "./editor-state.tests";

describe("entities", () => {
  it("transforms an editor state to apply an entity for a single arc", () => {
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
    expect(newContent.getBlocksAsArray()[0].getEntityAt(0)).toBe(entity.value);
    expect(newContent.getBlocksAsArray()[0].getEntityAt(4)).toBe(entity.value);
    expect(newContent.getBlocksAsArray()[0].getEntityAt(5)).toBe(null);
  });
});
