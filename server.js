const https = require("https");
const fs = require("fs");
const nodemailer = require('nodemailer');
const json2csv = require('json2csv');
const config = require('./config');

// get the last day
const today = new Date().getTime();
const yesterday = new Date(today - (24 * 60 * 60 * 1000));
const year = yesterday.getFullYear();
const month = yesterday.getMonth() + 1;
const day = yesterday.getDate();

const fName = './' + month + '-' + day + '.csv';

// Csv file
const generateCsv = (data) => {
  let csvFile = json2csv({
    data: data
  });
  let fName = './' + month + '-' + day + '.csv';

  fs.writeFile(fName, csvFile, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("fileSaved");
    CsvToMail(); // send the file
  });
};

// send get-request with token
https.get({
  host: 'api.twitter.com',
  path: `/1.1/search/tweets.json?q=airbnb+since%3A${year}-${month}-${day}&src=typd`,
  headers: {
    "Authorization": `Bearer ${config.accessToken}`
  }
}, (response) => {

  let data = '';
  response.on('data', (result) => {
    data += result;
  });
  response.on('end', () => {
    const tweets = JSON.parse(data);
    if (tweets.statuses !== 'undefined' && tweets.statuses.length != 0) {
      generateCsv(tweets.statuses)
    }
  });
});

// send mail with csv file
const CsvToMail = () => {
  const transporter = nodemailer.createTransport({
    service: config.nodemailer.service,
    auth: {
      user: config.nodemailer.userMail,
      pass: config.nodemailer.userPass
    }
  });

  const mailOptions = {
    from: config.nodemailer.userMail,
    to: config.nodemailer.mailTo,
    subject: fName,
    text: fName,
    attachments: [{
      path: fName
    }]
  };

  transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Message %s sent: %s', info.messageId, info.response)
    })
    .catch(err => {
      console.error(err)
    });
};