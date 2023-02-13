"use strict";
const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const { sendMail } = require("../services/mail.services");
const { default: axios } = require("axios");
let from = `StoneMor Survey <perinbaraja1996@gmail.com>`;

const app = express();
app.use(bodyParser.json());
const router = express.Router();
// //Allowing cors
app.use(cors());
// //Body parser
// app.use(express.json({ limit: "50mb" }));
// app.use(
//   express.urlencoded({
//     limit: "50mb",
//     extended: true,
//     parameterLimit: 500000,
//   })
// );

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});
router.post("/send", async (req, res) => {
  try {
    const { mail, qrCode, survey, loc } = req.body;

    console.log(qrCode, mail);
    const mailOptions = {
      from: from,
      to: mail,
      subject: `Scan the QR code for the ${loc} and attend the survey`,
      html: `<p><strong>
        Hello user,<br/><br/>
  Please Scan the attached QR code to attend the survey - ${survey} - ${loc} <br/><br/><br/>
  Regards,<br/> Stonemor Survey Team </strong></p>`,
      attachments: [
        {
          filename: `${survey}.png`,
          content: qrCode.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };
    const mailSent = await sendMail(mailOptions);
    res.json({ success: true, mailSent });
  } catch (err) {
    console.log("mailChat err: ", err);
    return res.json({ msg: err || config.DEFAULT_RES_ERROR });
  }
});

router.post("/pushData", async (req, res) => {
  try {
    const { data } = await axios.post(
      "https://a.klaviyo.com/api/v2/list",

      req.body,
      {
        headers: {
          Authorization: `Bearer pk_a2cec243366943810a1cedd1931fb8d6cc`,
        },
      }
    );
    res.send(data);
    res.json({ message: "Hello, World!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Middleware configuration
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "./index.html")));

module.exports = app;
module.exports.handler = serverless(app);
