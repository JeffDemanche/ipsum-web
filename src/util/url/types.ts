export type View = "" | "journal";

export type LayerType = "arc_detail";

export type Layer = {
  type: LayerType;
  objectId: string;
  connectionId: string;
};
