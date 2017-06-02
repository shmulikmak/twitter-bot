module.exports = {
  accessToken: '', // please add your token Authorization
  nodemailer: {
    service: process.env.MAIL_SERVICE ||  'gmail',
    userMail: process.env.USER_MAIL || '',                 // add to add your mail
    userPass: process.env.USER_PASS || '',                 // your password
    mailTo: process.env.MAIL_TO || ''  // add the mail-adress you want to send him the file
  }
}