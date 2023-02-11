import React, { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { IpsumURL } from "util/url";

export const DiptychContext = React.createContext<Diptych>({
  layers: [{ type: "DailyJournal" }],
  layersBySide: { 0: [], 1: [] },
});

interface DiptychProviderProps {
  children: React.ReactNode;
}

export const DiptychProvider: React.FunctionComponent<DiptychProviderProps> = ({
  children,
}) => {
  const location = useLocation();

  const urlLayers = useMemo(
    () =>
      new IpsumURL(new URL(window.location.href)).getJournalUrl().getLayers(),
    [location]
  );

  const [layers, setLayers] = useState<Layer[]>([{ type: "DailyJournal" }]);

  const layersBySide = useMemo(() => {
    return {
      0: layers.filter((l, i) => i % 2 === 0),
      1: layers.filter((l, i) => i % 2 !== 0),
    };
  }, [layers]);

  return (
    <DiptychContext.Provider
      value={{
        layers,
        layersBySide,
      }}
    >
      {children}
    </DiptychContext.Provider>
  );
};
