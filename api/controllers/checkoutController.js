const nodemailer = require('nodemailer');
const {returnTranslation} = require("../util/lang/translator.js")

const MailUtil = require("../util/MailUtil");

module.exports = class API {

	preorder(data){
		data = data.body
		if(!data.name || !data.email || !data.amount){
			return {status: 406, message: {error: "Invalid data"}}
		}

		let lang = "en"
		if(data.lang){
			lang = data.lang
		}

		let msg = returnTranslation(lang,"mails.preorder.text")

		msg = msg.replaceAll("%name%", data.name).replaceAll("%amount%", data.amount)

		let resp = await new MailUtil().sendMail(data.email,msg)
		if(Resp.error){
			return {status: 500, message: {error: Resp.error}}
		}
		return {status: 200, message: {message: "success"}}

	}


}