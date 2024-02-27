"use client";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
export const themeContext = createContext();
function ThemeContext({ children }) {
  const [light, setLight] = useState(true);
  

  return (
    <themeContext.Provider value={{ light, setLight }}>
      {children}
    </themeContext.Provider>
  );
}

export default ThemeContext;
