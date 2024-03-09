import { BreadcrumbType } from "components/Breadcrumb";
import { URLLayer, IpsumURLSearch } from "util/url";

export interface Diptych {
  layers: URLLayer[];
  topLayer: URLLayer;
  orderedBreadcrumbs: BreadcrumbType[];

  pushLayer: (layer: URLLayer) => void;
  popLayer: () => void;
  popHighlights: () => void;

  selectedHighlightId?: string;
  setSelectedHighlightId: (highlightId?: string) => void;

  sort: IpsumURLSearch<"journal">["sort"];
  setSort: (sort: IpsumURLSearch<"journal">["sort"]) => void;
}
