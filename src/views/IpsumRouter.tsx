import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ViewHome } from "./ViewHome";
import { ViewIndex } from "./ViewIndex";
import { ViewJournal } from "./ViewJournal";

export const IpsumRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ViewIndex />}>
          <Route index element={<ViewHome />} />
          <Route path="/journal" element={<ViewJournal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
