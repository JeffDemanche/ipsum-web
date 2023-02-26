export type View = "" | "journal";

export type LayerType = "arc_detail";

export type URLLayer = {
  type: LayerType;
  objectId?: string;
  connectionId?: string;
};
