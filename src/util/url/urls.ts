import { Layer, LayerType, View } from "./types";

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

  addLayer({ type, objectId, connectionId }: Layer): JournalViewURL {
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

  getLayers(): Layer[] {
    const searchParams = this._url.searchParams;
    const layers: Layer[] = [];
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
