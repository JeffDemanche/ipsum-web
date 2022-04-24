import React from "react";
import { Outlet } from "react-router";

export const ViewIndex: React.FC<{}> = () => {
  return (
    <>
      <div>TODO Index screen</div>
      <Outlet />
    </>
  );
};
