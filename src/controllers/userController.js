import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Tài khoản hoặc mật khẩu của bạn chưa chính xác!",
    });
  }
  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUser = async (req, res) => {
  let id = req.query.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Vui lòng điền đủ",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);
  console.log(users);
  return res.status(200).json({
    errCode: 0,
    errMessage: "Ok",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Thiếu tham số",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  console.log(message);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "error from sever",
    });
  }
};

let getTopDoctor = async (req, res) => {
  let limit = req.query.litmit;
  if (!limit) limit = 10;
  try {
    let response = await userService.getTopDoctor(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "lỗi sever",
    });
  }
};

let getDoctor = async (req, res) => {
  try {
    let doctors = await userService.getDoctor();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let postInfoDoctor = async (req, res) => {
  try {
    let response = await userService.saveInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let getInfoDoctor = async (req, res) => {
  try {
    let info = await userService.getInfoDoctorService(req.query.id);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let CreateCalendar = async (req, res) => {
  try {
    let info = await userService.CreateCalendarService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let getCalendar = async (req, res) => {
  try {
    let info = await userService.getCalendarService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let getIntroHospital = async (req, res) => {
  try {
    let info = await userService.getIntroHospital(req.query.doctorId);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let getProfileDoctor = async (req, res) => {
  try {
    let info = await userService.getProfileDoctor(req.query.doctorId);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let postBookAppoint = async (req, res) => {
  try {
    let info = await userService.postBookAppoint(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let getListExaminer = async (req, res) => {
  try {
    let info = await userService.getListExaminerService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};

let postSendInvoice = async (req, res) => {
  try {
    let info = await userService.postSendInvoiceService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi sever",
    });
  }
};
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUser: handleGetAllUser,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode,
  getTopDoctor: getTopDoctor,
  getDoctor: getDoctor,
  postInfoDoctor: postInfoDoctor,
  getInfoDoctor: getInfoDoctor,
  CreateCalendar: CreateCalendar,
  getCalendar: getCalendar,
  getIntroHospital: getIntroHospital,
  getProfileDoctor: getProfileDoctor,
  postBookAppoint: postBookAppoint,
  getListExaminer: getListExaminer,
  postSendInvoice: postSendInvoice,
};
