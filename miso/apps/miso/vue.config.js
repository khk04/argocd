const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  //npm run build 하면 지정된 경로로 생성한다.
  outputDir: "/app/dist/",
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
    LoginView: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "login/index.html",
      chunks: ["chunk-vendors", "chunk-common", "LoginView"],
    },
    AdminView: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "admin/index.html",
      chunks: ["chunk-vendors", "chunk-common", "AdminView"],
    },
  },
  publicPath: "/",
});
