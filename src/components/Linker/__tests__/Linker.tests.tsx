import { ApolloProvider } from "@apollo/client";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { client } from "util/apollo";
import { Linker } from "../Linker";

describe("Linker", () => {
  it("should show and focus textbox on plus click", () => {
    render(
      <ApolloProvider client={client}>
        <Linker />
      </ApolloProvider>
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Add or link arc" });
    fireEvent.click(button);

    expect(screen.getByRole("textbox")).toBeVisible();
    expect(screen.getByRole("textbox")).toHaveFocus();
  });
});
