"use client";

import { useEffect, useContext } from "react";
import { themeContext } from "./ThemeContext";
function StoreColor() {
  const { light, setLight } = useContext(themeContext);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      localStorage.getItem("--primary-color")
    );
    document.documentElement.style.setProperty(
      "--third-color",
      localStorage.getItem("--third-color")
    );
    document.documentElement.style.setProperty(
      "--fourth-color",
      localStorage.getItem("--fourth-color")
    );
    document.documentElement.style.setProperty(
      "--fifth-color",
      localStorage.getItem("--fifth-color")
    );
    document.documentElement.style.setProperty(
      "--sixth-color",
      localStorage.getItem("--sixth-color")
    );
    document.documentElement.style.setProperty(
      "--seventh-color",
      localStorage.getItem("--seventh-color")
    );
    document.documentElement.style.setProperty(
      "--eighth-color",
      localStorage.getItem("--eighth-color")
    );
  }, [light, setLight]);
}

export default StoreColor;
// qidpuj-nuhqev-9zovFa
