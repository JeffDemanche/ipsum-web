import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApolloSerializationProvider } from "util/apollo";

import { ViewHome } from "./ViewHome";
import { ViewIndex } from "./ViewIndex";
import { ViewJournal } from "./ViewJournal";

export const IpsumRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ApolloSerializationProvider>
        <Routes>
          <Route path="/" element={<ViewIndex />}>
            <Route index element={<ViewHome />} />
            {/** See urls.ts */}
            <Route path="journal" element={<ViewJournal />}>
              <Route path=":date" element={<ViewJournal />}></Route>
            </Route>
          </Route>
        </Routes>
      </ApolloSerializationProvider>
    </BrowserRouter>
  );
};
