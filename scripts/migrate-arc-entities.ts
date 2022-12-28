import { ContentBlock, Modifier, SelectionState } from "draft-js";
import { readFileSync, promises } from "fs";
import {
  parseContentState,
  stringifyContentState,
} from "../src/util/content-state";

const path = process.argv[2];

const data = readFileSync(path, { encoding: "utf-8" });

const object = JSON.parse(data);

Object.keys(object.entries).forEach((key) => {
  const cs = parseContentState(object.entries[key].contentState) as any;
  cs.set("entityMap", {});
  let newCs = cs;
  cs.getBlockMap().forEach((block: ContentBlock) => {
    const blockKey = block.getKey();
    const blockText = block.getText();
    // You need to create a selection for entire length of text in the block
    const selection = SelectionState.createEmpty(blockKey);
    const updatedSelection = selection.merge({
      //anchorOffset is the start of the block
      anchorOffset: 0,
      // focustOffset is the end
      focusOffset: blockText.length,
    });
    newCs = Modifier.applyEntity(newCs, updatedSelection, null);
  });
  object.entries[key].contentState = stringifyContentState(newCs);
});

const newObject = {
  ...object,
  arcAssignments: {},
  arcs: {},
};

delete newObject.entities;

promises.writeFile(path, JSON.stringify(newObject));
