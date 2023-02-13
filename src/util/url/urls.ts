import { URLLayer, LayerType, View } from "./types";

export class IpsumURL {
  private _url: URL;

  constructor(url: URL) {
    this._url = url;
  }

  getView(): View {
    return (this._url.pathname.split("/")[1] ?? "") as View;
  }

  getJournalUrl(): JournalViewURL {
    if (this.getView() !== "journal") return undefined;

    return new JournalViewURL(this._url);
  }
}

class JournalViewURL {
  private _url: URL;

  constructor(url: URL) {
    this._url = url;
  }

  get url() {
    return this._url;
  }

  pushLayer({ type, objectId, connectionId }: URLLayer): JournalViewURL {
    const newUrl = new URL(this._url.toString());
    let highestLayer = 0;
    for (const paramName of this._url.searchParams.keys()) {
      if (paramName.length === 2 && paramName.charAt(0) === "l") {
        const num = Number.parseInt(paramName.charAt(1));
        if (!isNaN(num) && num > highestLayer) {
          highestLayer = num;
        }
      }
    }

    newUrl.searchParams.append(
      `l${highestLayer + 1}`,
      `${type},${objectId},${connectionId}`
    );
    return new JournalViewURL(newUrl);
  }

  /**
   * Sets the layer at `index` to the provided `layer` and removes all layers
   * above it.
   */
  setTopLayer(index: number, layer?: URLLayer): JournalViewURL {
    if (layer && (!index || index <= 0)) return this.pushLayer(layer);

    const newUrl = new URL(this._url.toString());
    const existingLayerNums: number[] = [];
    for (const paramName of this._url.searchParams.keys()) {
      if (paramName.length === 2 && paramName.charAt(0) === "l") {
        const num = Number.parseInt(paramName.charAt(1));
        if (!isNaN(num)) {
          newUrl.searchParams.delete(paramName);
          existingLayerNums.push(num);
        }
      }
    }
    existingLayerNums.sort();
    existingLayerNums.forEach((layerNum) => {
      // If layer is provided we remove the layer at index, otherwise don't.
      const removeAtIndex = layer ? 0 : 1;
      if (layerNum < index + removeAtIndex) {
        newUrl.searchParams.append(
          `l${layerNum}`,
          this._url.searchParams.get(`l${layerNum}`)
        );
      }
    });
    const result = new JournalViewURL(newUrl);
    if (layer) return result.pushLayer(layer);
    else return result;
  }

  getLayers(): URLLayer[] {
    const searchParams = this._url.searchParams;
    const layers: URLLayer[] = [];
    let i = 1;
    let layer = `l${i}`;
    while (searchParams.has(layer)) {
      const paramValue = searchParams.get(layer);
      const type = paramValue.split(",")[0] as LayerType;
      const objectId = paramValue.split(",")[1];
      const connectionId = paramValue.split(",")[2];

      if (!type || !objectId || !connectionId)
        throw new Error("URL invariant: bad layer");

      layers.push({ type, objectId, connectionId });
      i++;
      layer = `l${i}`;
    }
    return layers;
  }
}
