const nodemailer = require('nodemailer');
const {returnTranslation} = require("../util/lang/translator.js")

module.exports = class MailUtil {

	sendMail(email, msg){
		return new Promise((resolve, reject) => {
		try{
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: "mail.thegreatshop@gmail.com",
					// pass: "iCanHazMails"
					pass: "ftnstptqsyntjmzk"
				}
			});
			const mailConfigurations = {
				from: 'mail.thegreatshop@gmail.com',
				to: email,
				subject: returnTranslation(lang,"mails.preorder.title"),
				html: msg
			};
			transporter.sendMail(mailConfigurations, function(error, info) {
				if (error){
					resolve({error: error})
				}
			});
			resolve({message: "success"})
		}catch(e){
			resolv({error: e})
		}
		})
	}

}