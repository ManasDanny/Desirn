import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import 'katex/dist/katex.min.css';

const Preview = ({ content }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current) {
      const htmlContent = marked(content.replace(/\\\\/g, '\\\\\\\\'));

      previewRef.current.innerHTML = htmlContent;

      renderMathInElement(previewRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },  
          { left: "\\(", right: "\\)", display: false },
          { left: "$", right: "$", display: false } 
        ],
        throwOnError: false
      });
    }
  }, [content]);

  return (
    <div className="preview" ref={previewRef}>
      {}
    </div>
  );
};

export default Preview;