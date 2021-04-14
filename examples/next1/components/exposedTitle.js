import React, { useEffect } from "react";

const _ = (await import("lodash")).default;

const ExposedTitle = () => {
  console.log("Loaded remote component!");
  console.log("Remote loadash version: ", _.VERSION);
  useEffect(() => {
    console.log("Remote component hooks work!");
  }, []);
  return (
    <div className="hero centered box">
      <h1 className="title">
        This section came from <code>next1</code>.
      </h1>
      <p className="description">And it works like a charm!</p>
      <style jsx>{`
        .centered {
          text-align: center;
        }
        .box {
          background: #ececec;
          padding: 1em;
        }
      `}</style>
    </div>
  );
};

export default ExposedTitle;
