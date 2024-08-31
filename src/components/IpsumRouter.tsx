import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomeView } from "./views/HomeView/HomeView";
import { JournalView } from "./views/JournalView";

export const IpsumRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomeView />} />
          {/** See urls.ts */}
          <Route path="journal" element={<JournalView />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
