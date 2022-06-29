const MailUtil = require("../util/MailUtil");
module.exports = class API {
	async debugMail(data){
		let body = data.body

		console.log(body.mail)

		if(!body.mail){
			return {status: 406, message: {message: "No mail provided"}}
		}

		console.log("Sending mail to: " + body.mail)

		await new MailUtil().sendFakeMail(body.mail)
		return {status: 200, message: {message: "success"}}

	}
}