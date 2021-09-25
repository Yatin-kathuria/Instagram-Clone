const nodemailer = require("nodemailer");
const sendgridtransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridtransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
);

module.exports = transporter;
