const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const fs = require("fs");
const mustache = require("mustache");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "mthariqfarsha@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/templates/email/${data.template}`,
        "utf8"
      );

      const mailOption = {
        from: '"Tickitix" <mthariqfarsha@gmail.com>',
        to: data.to,
        subject: data.subject,
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }),
};
