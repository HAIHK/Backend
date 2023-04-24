import express from "express";

let configViewEngine = (app) => {
  app.use(express.static("./src/public")); // static dùng để cấu hình  đường link để client truy cập vào file nào
  app.set("view engine", "ejs"); // dùng viewengine có tên ejs , ejs là 1 thư viện , có thể gõ logic trong html như if else
  app.set("views", "./src/views"); // set đuong link se lấy viewengine
};

module.exports = configViewEngine;
