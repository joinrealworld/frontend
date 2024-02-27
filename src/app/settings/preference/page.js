"use client";
import SettingsMenu from "@/components/SettingsMenu";
import "./../styles.css";
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { darkTheme } from "@/themes/darkTheme";
import { lightTheme } from "@/themes/lightTheme";

function page(props) {
  const [activeDark, setActiveDark] = useState();
  const [mountTheme, setMountTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) || "dark"
  );
  const [activeLight, setActiveLight] = useState();
  const [darkCheck, setDarkCheck] = useState(true);
  const [lightCheck, setLightCheck] = useState(false);
  const brdrStyleDark = {
    border: "3px solid var(--secondary-color)",
    backgroundColor: "#1E2124",
  };
  const brdrStyleLight = {
    border: "3px solid var(--secondary-color)",
    backgroundColor: "#1E2124",
  };

  useEffect(() => {
    if (mountTheme === "dark") {
      setActiveDark(brdrStyleDark);
    } else {
      setActiveLight(brdrStyleLight);
      setLightCheck(true);
    }
  }, []);
  useEffect(() => {
    // setActiveDark(brdrStyleDark);
    localStorage.setItem("theme", JSON.stringify(mountTheme));
  }, [mountTheme]);

  const darkThemeButton = () => {
    setMountTheme("dark");
    setActiveDark(brdrStyleDark);
    setActiveLight(null);
    setDarkCheck(true);
    setLightCheck(false);
    darkTheme();
  };
  const lightThemeButton = () => {
    setMountTheme("light");
    setActiveDark(null);
    setActiveLight(brdrStyleLight);
    setDarkCheck(false);
    setLightCheck(true);
    lightTheme();
  };
  // useEffect(() => {
  //   const themeSwitch = JSON.parse(localStorage.getItem("light"));
  //   const color = localStorage.getItem("--primary-color");
  //   if (!themeSwitch && color) {
  //     setLight(themeSwitch);
  //   }
  // }, []);
  return (
    <div className="container-kab38c">
      <SettingsMenu {...props} />
      <div className="right-side-8cnac">
        <div className="content-3mcnaj3zcs">
          {" "}
          <h3 style={{ color: "var(--fourth-color)" }}>Preferences</h3>
          <h4 className="pt-5 pb-2" style={{ color: "var(--fourth-color)" }}>
            Theme
          </h4>
          <div className="flex gap-4">
            <div className="flex flex-col justify-center relative">
              <div
                className="w-14 h-14 rounded-full bg-black cursor-pointer"
                style={activeDark}
                onClick={darkThemeButton}
              >
                {darkCheck && mountTheme === "dark" && (
                  <span
                    className="absolute text-white text-center flex justify-center top-0 w-8 rounded-full"
                    style={{ backgroundColor: "var(--secondary-color)" }}
                  >
                    <Check size={20} color="white" className="font-extrabold" />
                  </span>
                )}
              </div>

              <span
                style={{ color: "var(--fourth-color)" }}
                className="text-center pt-2"
              >
                Dark
              </span>
            </div>
            <div className="flex flex-col justify-center relative">
              <div
                className="w-14 h-14 rounded-full bg-white cursor-pointer"
                style={activeLight}
                onClick={lightThemeButton}
              ></div>
              {console.log(mountTheme)}
              {lightCheck && mountTheme === "light" && (
                <span
                  className="absolute text-white text-center flex justify-center top-0 w-8 rounded-full"
                  style={{ backgroundColor: "var(--secondary-color)" }}
                >
                  <Check size={20} color="white" className="font-extrabold" />
                </span>
              )}
              <span
                style={{ color: "var(--fourth-color)" }}
                className="text-center pt-2"
              >
                Light
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
