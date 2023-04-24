require("dotenv").config();
import nodemailer from "nodemailer";

let sendEmailService = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Đặt lịch khám bệnh KangNam " <masteryizin@gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: "Thông báo đặt lịch khám bệnh", // Subject line

    html: getBodyEmail(dataSend),
  });
};

let getBodyEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h3>Xin chào ${dataSend.examiner}!</h3>
    <p>Chúng tôi đã nhận được thông báo đặt lịch khám trên KangNam</p>
    <p>Thông tin đặt lịch:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctor}</b></div>
    
    <p>Chúng tôi gửi bạn thông tin trên để bạn xác thực. Nếu như các thông tin trên là đúng, bạn vui lòng click vào link bên dưới để hoàn tất thủ tục đặt lịch</p>
    <div>
    <a href=${dataSend.linkCheck} target="_blank">Click here</a>
    </div>

    <p>Xin chân thành cảm ơn</>
    `;
  }
  if (dataSend.language === "en") {
    result = `<h3>Hello ${dataSend.examiner}!</h3>
    <p>We have received a notice to book an appointment on KangNam</p>
    <p>Booking information:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctor}</b></div>
    
    <p>We send you the above information for your verification. If the above information is correct, please click on the link below to complete the booking process</p>
    <div>
    <a href=${dataSend.linkCheck} target="_blank">Click here</a>
    </div>

    <p>Sincerely thank</>
    `;
  }

  return result;
};
let getBodyEmailInvoice = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h3>Xin chào ${dataSend.name}!</h3>
    <p>Chúng tôi xin cảm ơn bạn đã sử dụng dịch vụ bên chúng tôi</p>
    <p>Chúng tôi xin gửi bạn hoá đơn khám.</p>
   
    
  

    <p>Xin chân thành cảm ơn</>
    `;
  }
  if (dataSend.language === "en") {
    result = `<h3>Hello ${dataSend.name}!</h3>
    <p>We have received a notice to book an appointment on KangNam</p>

    <p>Sincerely thank</>
    `;
  }

  return result;
};
let sendEmailInvoice = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Đặt lịch khám bệnh KangNam " <masteryizin@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả và hoá đơn", // Subject line
    html: getBodyEmailInvoice(dataSend),
    attachments: [
      {
        filename: `invoice-${dataSend.examinerId}-${new Date().getTime()}.png`,
        content: dataSend.imgBase.split("base64")[1],
        encoding: "base64",
      },
    ],
  });
};

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
}

module.exports = {
  sendEmailService: sendEmailService,
  getBodyEmail: getBodyEmail,
  sendEmailInvoice: sendEmailInvoice,
};
