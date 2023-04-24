import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
// import doctorController from "../controllers/doctorController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);

  router.post("/put-crud", homeController.PutCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUser);
  router.post("/api/new-users", userController.handleCreateNewUser);
  router.put("/api/edit-users", userController.handleEditUser);
  router.delete("/api/delete-users", userController.handleDeleteUser);

  router.get("/api/getCode", userController.getAllCode);

  router.get("/api/top-doctor", userController.getTopDoctor);
  router.get("/api/get-doctor", userController.getDoctor);
  router.post("/api/post-info-doctor", userController.postInfoDoctor);

  router.get("/api/get-info-doctor", userController.getInfoDoctor);
  router.post("/api/create-calendar", userController.CreateCalendar);
  router.get("/api/get-calendar", userController.getCalendar);
  router.get("/api/get-Intro-Hospital", userController.getIntroHospital);
  router.get("/api/get-Profile-Doctor", userController.getProfileDoctor);

  router.post("/api/post-Book-Appoint", userController.postBookAppoint);
  router.get("/api/get-list-Examiner", userController.getListExaminer);
  router.post("/api/post-send-Invoice", userController.postSendInvoice);

  // router.post("/api/post-confirm-Apponint", userController.postConfirmAppoint);

  return app.use("/", router);
};

module.exports = initWebRoutes;
