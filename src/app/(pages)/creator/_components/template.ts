export const templateList: any[] = [
  {
    value: "static",
    label: "Static",
    dependencies: {},
    files: {
      "/index.html": {
        code: `<html>
  <head>
    <title>Static Template</title>
    <link rel="stylesheet" href="/style.css">
    <script src="/script.js"></script>
  </head>
  <body>
    <h1>Hello Static!</h1>
  </body>
</html>`,
      },
      "/style.css": {
        code: `body { font-family: Arial, sans-serif; }`,
      },
      "/script.js": {
        code: `console.log("Hello Static!");`,
      },
    },
  },
  {
    value: "vanilla",
    label: "Vanilla",
    dependencies: {},
    files: {
      "/index.js": {
        code: `document.body.innerHTML = "<h1>Hello Vanilla!</h1>";`,
      },
    },
  },
  {
    value: "react",
    label: "React",
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      tailwindcss: "^3.4.1",
      postcss: "^8.4.38",
      autoprefixer: "^10.4.19",
    },
    files: {
      "/tailwind.css": {
        code: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      },
      "/index.js": {
        code: `import "./tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);`,
      },
      "/App.js": {
        code: `export default function App() {
  return <h1 className="text-2xl font-bold text-blue-600">Hello React!</h1>;
};`,
      },
      "/postcss.config.js": {
        code: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
      },
      "/tailwind.config.js": {
        code: `module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
      },
    },
  },
  {
    value: "vue",
    label: "Vue",
    dependencies: {
      vue: "^3.4.0",
      "element-plus": "^2.7.2",
      tailwindcss: "^3.4.1",
      postcss: "^8.4.38",
      autoprefixer: "^10.4.19",
    },
    files: {
      "src/tailwind.css": {
        code: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      },
      "src/main.js": {
        code: `import { createApp } from "vue";
import App from "./App.vue";
import "./tailwind.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");`,
      },
      "src/App.vue": {
        code: `<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-green-600">Hello Vue with Tailwind + Element UI!</h1>
    <el-button type="primary" class="mt-4">主要按钮</el-button>
  </div>
</template>`,
      },
      "postcss.config.js": {
        code: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
      },
      "tailwind.config.js": {
        code: `module.exports = {
  content: ["./src/**/*.{vue,js,ts}", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
      },
    },
  },
];
