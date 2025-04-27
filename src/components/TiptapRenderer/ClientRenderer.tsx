// src/components/TiptapRenderer/ClientRenderer.tsx
"use client";

import { createElement, Fragment, useEffect, useState } from "react";
import { components } from "./components/custom";
import { createProcessor } from "./utils/processor";
import "./tiptap-content.scss"; // Import the styles, but you need to create this file

interface TiptapRendererProps {
  children: string;
}

const TiptapRenderer = ({ children }: TiptapRendererProps) => {
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(
    function () {
      (async function () {
        const processor = createProcessor({ components });
        const output = await processor.process(children);

        setContent(output.result);
      })();
    },
    [children]
  );

  // The key change is here - wrap the content in a div with the tiptap-content class
  return <div className="tiptap-content">{Content}</div>;
};

export default TiptapRenderer;
