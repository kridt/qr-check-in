const express = require("express");
const app = express();
const moment = require("moment-timezone");
const port = 6969;
var nodemailer = require("nodemailer");
var admin = require("firebase-admin");
const cors = require("cors");
app.use(cors());
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chrnielsen2003@gmail.com",
    pass: "dcql iave mxcf vhmv",
  },
});
var serviceAccount = require("./qr-admin-1b3aa-firebase-adminsdk-7jlex-b0c072e997.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
  const locationName = data.locationName.replaceAll(" ", "");

  console.log(data);

  admin
    .firestore()
    .collection("locations")
    .doc(`${data.locationId}-${locationName}`)
    .collection("times")
    .doc(`${dkDate.replaceAll("/", "-")}-${locationName}`)
    .collection("corworkers")
    .doc(
      `${data.checkId}-${data.firstName.replaceAll(
        " ",
        "-"
      )}-${data.lastName.replaceAll(" ", "-")}-${data.coworkerId}`
    )
    .create({
      checkId: data.checkId,
      firstName: data.firstName,
      lastName: data.lastName,
      coworkerId: data.coworkerId,
      time: dkTime,
      date: dkDate,
    })

    .then(() => {
      sendMail(
        `${data.firstName} har stemplet ${data.checkId}`,
        dkTime,
        dkDate
      );
      res.status(200).send("OK");
    })
    .catch((error) => {
      console.log(error);
      res.status(202).json({ error: error });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
