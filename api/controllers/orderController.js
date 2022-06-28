const MailUtil = require("../util/MailUtil");
const OrderUtil = require("../util/OrderUtil");


const {returnTranslation} = require("../util/lang/translator.js")

module.exports = class API{
	async preorder(data){
		data = data.body
		if(!data.name || !data.email || !data.amount){
			return {status: 406, message: {error: "Invalid data"}}
		}

		let lang = "en"
		if(data.lang){
			lang = data.lang
		}

		new OrderUtil().addOrder(data.name,data.email,data.amount)

		let msg = returnTranslation(lang,"mails.preorder.text")

		msg = msg.replaceAll("%name%", data.name).replaceAll("%amount%", data.amount)

		let resp = await new MailUtil().sendMail(data.email,msg)
		if(resp.error){
			return {status: 500, message: {error: Resp.error}}
		}
		return {status: 200, message: {message: "success"}}

	}

	async getOrders(){
		let resp = await new OrderUtil().getOrders()
		if(resp.error){
			return {status: 500, message: {error: resp.error}}
		}
		return {status: 200, message: {message: "success",data: resp}}
	}

	async acceptOrder(data){
		let resp = await new OrderUtil().acceptOrder(data.body.id)
		if(resp.error){
			return {status: 500, message: {error: resp.error}}
		}
		return {status: 200, message: {message: "success"}}
	}

	async deleteOrder(data){
		let resp = await new OrderUtil().deleteOrder(data.body.id)
		if(resp.error){
			return {status: 500, message: {error: resp.error}}
		}
		return {status: 200, message: {message: "success"}}
	}
}