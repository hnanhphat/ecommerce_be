const Mailgun = require("mailgun-js");
const Email = require("../models/Email");
require("dotenv").config();

const mailgun = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const emailInternalHelper = {};
const emailHelper = {};

emailInternalHelper.createTemplatesIfNotExists = async () => {
  try {
    const email = await Email.findOne({ email_key: "verify_email" });
    if (!email) {
      const emailTemplate = new Email({
        title: "Verify Email Template",
        description: "This template is used when user register new email",
        email_key: "verify_email",
        from: "phat.hna2311@gmail.com",
        subject: "Hi %username%, Welcome to Rune House",
        html: `<h3>Hi %username%</h3>,<br /><br />
        To complete email verification, please press the button below.<br /><br />
        <a href="%code%" target="_blank" style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #d67b35; text-decoration: none; border: none; -webkit-border-radius: 100px; -moz-border-radius: 100px; border-radius: 100px; display: inline-block;"><span style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:bold; line-height:1.5em; text-align:center;">Verify your Email</span></a>
        or verify using this link: %code%<br /><br /><br />
        If you did not create an account using this address, please ignore this mail.<br /><br /><br />
        If you have any difficulty during the sign-up, do get in touch with our support hnanhphat@gmail.com
        <br/>Barry Hoang`,
        variables: ["username", "code"],
      });
      await emailTemplate.save();
    }
  } catch (error) {
    console.log(error.message);
  }
};

emailHelper.renderEmailTemplate = async (email_key, variablesObj, toEmail) => {
  try {
    // 1. Email is exist in emailSchema
    const email = await Email.findOne({ email_key });
    if (!email) {
      return { error: "Invalid Email Key" };
    }

    // 2. Make data
    const data = {
      from: email.from,
      to: toEmail,
      subject: email.subject,
      html: email.html,
    };

    // 3. Dynamic variables to given variables
    for (let i = 0; i < email.variables.length; i++) {
      let key = email.variables[i];
      if (!variablesObj[key]) {
        return { error: `Invalid variable key: Missing ${key}` };
      }
      let re = new RegExp(`%${key}%`, "g"); // Find all matche rather than stopping after the first match
      data.subject = data.subject.replace(re, variablesObj[key]);
      data.html = data.html.replace(re, variablesObj[key]);
    }

    // 4. Return data
    return data;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
};

emailHelper.send = async (data) => {
  mailgun.messages().send(data, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};

module.exports = { emailInternalHelper, emailHelper };
