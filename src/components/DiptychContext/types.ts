import { BreadcrumbType } from "components/Breadcrumb";
import { URLLayer } from "util/url";

export interface Diptych {
  layers: URLLayer[];
  topLayer: URLLayer;
  orderedBreadcrumbs: BreadcrumbType[];

  pushLayer: (layer: URLLayer) => void;
  popLayer: () => void;
  setTopHighlightFrom: (
    highlightFrom: string,
    highlightFromEntryKey: string
  ) => void;
  setTopHighlightTo: (
    highlightTo: string,
    highlightFromEntryKey: string
  ) => void;
  popHighlights: () => void;

  selectedHighlightId?: string;
  setSelectedHighlightId: (highlightId?: string) => void;
}
