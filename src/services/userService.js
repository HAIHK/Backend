import db from "../models/index";
import bcrypt from "bcryptjs";
require("dotenv").config();

import emailService from "./emailService";
import _, { reject } from "lodash";
import { promises } from "nodemailer/lib/xoauth2";

const MAX_NUMBER_CALENDAR = process.env.MAX_NUMBER_CALENDAR;

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "positionId",
            "password",
            "firstName",
            "lastName",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Mật khẩu không đúng";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `Không tìm thấy người dùng`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Tên tài khoản của bạn không chính xác`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: " email đã dùng",
        });
      } else {
        let hashPasswordFromBcypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          positionId: data.positionId,
          qualificationId: data.qualificationId,
          image: data.image,
        });
        resolve({
          errCode: 0,
          message: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: { id: userId },
    });
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: "không có user",
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });
    resolve({
      errCode: 0,
      message: "đã xoá",
    });
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.positionId ||
        !data.qualificationId ||
        !data.gender
      ) {
        resolve({
          errCode: 2,
          errMessage: "Không thấy tham số",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonenumber = data.phonenumber;
        user.gender = data.gender;
        user.positionId = data.positionId;
        user.qualificationId = data.qualificationId;
        if (data.image) {
          user.image = data.image;
        }

        await user.save();
        resolve({
          errCode: 0,
          message: "update thành công",
        });
      } else {
        resolve({
          errCode: 1,
          message: "k tìm thấy user",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "chua co tham so",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getTopDoctor = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { positionId: "P2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "qualificationDt",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderDt",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { positionId: "P2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action ||
        !inputData.selectPrice ||
        !inputData.selectPayment ||
        !inputData.selectProvince ||
        !inputData.nameHospital ||
        !inputData.addressHospital ||
        !inputData.note
      ) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số",
        });
      } else {
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            describe: inputData.describe,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.describe = inputData.describe;

            await doctorMarkdown.save();
          }
        }
        let doctorInfor = await db.Hospital_Info.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });

        if (doctorInfor) {
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectPrice;
          doctorInfor.provinceId = inputData.selectProvince;
          doctorInfor.paymentId = inputData.selectPayment;
          doctorInfor.nameHospital = inputData.nameHospital;
          doctorInfor.addressHospital = inputData.addressHospital;
          doctorInfor.note = inputData.note;
          await doctorInfor.save();
        } else {
          await db.Hospital_Info.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectPrice,
            provinceId: inputData.selectProvince,
            paymentId: inputData.selectPayment,
            nameHospital: inputData.nameHospital,
            addressHospital: inputData.addressHospital,
            note: inputData.note,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getInfoDoctorService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["describe", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "qualificationDt",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Hospital_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let CreateCalendarService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrCalendar || !data.doctorId || !data.formatDate) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số",
        });
      } else {
        let calendar = data.arrCalendar;
        if (calendar && calendar.length > 0) {
          calendar = calendar.map((item) => {
            item.maxNumber = MAX_NUMBER_CALENDAR;
            return item;
          });
        }

        let existing = await db.Calendar.findAll({
          where: { doctorId: data.doctorId, date: data.formatDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        console.log("check existing", existing);
        console.log("create", calendar);

        let toCreate = _.differenceWith(calendar, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        if (toCreate && toCreate.length > 0) {
          await db.Calendar.bulkCreate(toCreate);
        }
        resolve({
          errCode: 0,
          errMessage: "Thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getCalendarService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số",
        });
      } else {
        let dataCalendar = await db.Calendar.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!dataCalendar) dataCalendar = [];
        resolve({
          errCode: 0,
          data: dataCalendar,
        });
      }
    } catch ({ e }) {
      reject(e);
    }
  });
};

let getIntroHospital = (idInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idInput) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số",
        });
      } else {
        let data = await db.Hospital_Info.findOne({
          where: {
            doctorId: idInput,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctor = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham sô",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["describe", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "qualificationDt",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Hospital_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postBookAppoint = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectGender ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số",
        });
      } else {
        await emailService.sendEmailService({
          reciverEmail: data.email,
          examiner: data.fullName,
          time: data.timeString,
          doctor: data.doctorName,
          language: data.language,
          linkCheck: "https://www.youtube.com/watch?v=zrUK-5Tt_ZY",
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            positionId: "P3",
            gender: data.selectGender,
            address: data.address,
            firstName: data.fullName,
          },
        });
        if (user && user[0]) {
          await db.Book.findOrCreate({
            where: { examinerId: user[0].id },
            defaults: {
              StatusId: "ST1",
              doctorId: data.doctorId,
              examinerId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getListExaminerService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số",
        });
      } else {
        let data = await db.Book.findAll({
          where: {
            StatusId: "ST1",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "examinerDt",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderDt",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataExaminer",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postSendInvoiceService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId | !data.examinerId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham sô",
        });
      } else {
        let pay = await db.Book.findOne({
          where: {
            doctorId: data.doctorId,
            examinerId: data.examinerId,
            timeType: data.timeType,
            StatusId: "ST1",
          },
          raw: false,
        });
        if (pay) {
          pay.StatusId = "ST2";
          await pay.save();
        }
        await emailService.sendEmailInvoice(data);

        resolve({
          errCode: 0,
          data: "Thanh cong",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
  getTopDoctor: getTopDoctor,
  getDoctor: getDoctor,
  saveInfoDoctor: saveInfoDoctor,
  getInfoDoctorService: getInfoDoctorService,
  CreateCalendarService: CreateCalendarService,
  getCalendarService: getCalendarService,
  getIntroHospital: getIntroHospital,
  getProfileDoctor: getProfileDoctor,
  postBookAppoint: postBookAppoint,
  getListExaminerService: getListExaminerService,
  postSendInvoiceService: postSendInvoiceService,
};
