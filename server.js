const express = require("express");
const app = express();
const port = 6969;
const { format, fromUnixTime } = require("date-fns");
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
  let timestamp = new Date().getTime();
  let unixTimestamp = timestamp;
  let date = fromUnixTime(unixTimestamp / 1000);
  const data = req.query;
  let formattedDate = format(date, "dd-MM-yyyy");
  let formattedTime = format(date, "HH:mm");

  console.log("klokken er:", formattedTime);

  sendMail(
    `${data.firstName} har stemplet ${data.checkId}`,
    formattedTime,
    formattedDate
  );

  console.log(data);
  res.json({ time: formattedTime, date: formattedDate });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
