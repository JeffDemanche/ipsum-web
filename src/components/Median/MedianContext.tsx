import React from "react";

interface MedianContextValue {}

const defaultMedianContextValue: MedianContextValue = {};

export const MedianContext = React.createContext(defaultMedianContextValue);
