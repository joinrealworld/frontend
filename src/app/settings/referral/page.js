"use client";
import SettingsMenu from "@/components/SettingsMenu";
import React, { useRef, useState } from "react";
import { ClipboardList } from "lucide-react";
function page(props) {
  const [copyText, setCopyText] = useState("");
  const copyRef = useRef();
  const copyToclipboard = async () => {
    await navigator.clipboard.writeText(copyRef.current.innerHTML);
    setCopyText("textcopy");
  };
  setTimeout(() => {
    setCopyText("");
  }, 5000);
  return (
    <div className="container-kab38c">
      <SettingsMenu {...props} />
      <div className="right-side-8cnac">
        <div className="content-3mcnaj3zcs">
          <div className="relative">
            <h4 style={{ color: "var(--fourth-color)" }} ref={copyRef}>
              Refer a friend
            </h4>
            <div
              className="absolute end-0 top-0 cursor-pointer text-sm"
              style={{ color: "var(--fourth-color)" }}
            >
              {copyText === "textcopy" ? (
                "copied !"
              ) : (
                <ClipboardList
                  color="var(--fourth-color)"
                  onClick={copyToclipboard}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
