const express = require("express");
const app = express();
const moment = require("moment-timezone");
const port = 6969;
var nodemailer = require("nodemailer");
const cors = require("cors");
app.use(cors());
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chrnielsen2003@gmail.com",
    pass: "dcql iave mxcf vhmv",
  },
});

const dkTime = moment().tz("Europe/Copenhagen").format("HH:mm");
const dkDate = moment().tz("Europe/Copenhagen").format("DD/MM/YYYY");

function sendMail(action, time, data) {
  var mailOptions = {
    from: "chrnielsen2003@gmail.com",
    to: "loui.papi@gmail.com",
    subject: `${action} ${time} ${data}`,
    text: `${action} tid: ${time} ${data}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

app.get("/api/start", (req, res) => {
  const data = req.query;

  sendMail(`${data.firstName} har stemplet ${data.checkId}`, dkTime, dkDate);

  console.log(data);
  res.json({ time: dkTime, date: dkDate });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
