"use client";

import {
  Sandpack,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

export default function SandpackCom() {
  const css = `
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
  color: #333;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to the Test Page</h1>
    <p>This is a simple test page to demonstrate the use of Sandpack.</p>
  </div>
</body>
</html>`;
  const js = `console.log("Hello, Sandpack!");`;
  const files = {
    "/index.html": {
      code: html,
      active: true,
    },
    "/styles.css": {
      code: css,
    },
    "/script.js": {
      code: js,
    },
  };
  return (
    <>
      <Sandpack template="static" files={files} />
      <Sandpack
        template="react"
        files={{
          "/App.js": `export default function App() {
  return <h1>Hello Sandpack!!</h1>
}`,
        }}
      />
      <Sandpack
        template="vite-vue"
        files={{
          "src/App.vue": `<template>
                        <h1>Hello Vue Sandpack!!</h1>
                      </template>
                      <script>
                      export default {
                        name: 'App',
                      };
                      </script>`,
        }}
      />
      <Sandpack
        files={{
          "index.js": `
            console.log("hi")
          `,
        }}
        options={{
          layout: "console", // preview | tests | console
        }}
      />
    </>
  );
}
