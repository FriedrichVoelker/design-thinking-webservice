const AuthUtil = require("../util/AuthUtil");

module.exports = class API {

	async inform(data){
		return {status: 200, message: {data: await new AuthUtil().decodeToken(data.auth)}};
	}

	async checkAuth(data){
		let resp = await new AuthUtil().checkAuth(data.auth)
		if(!resp){
			return {status: 401, message: {message: "Not authorized"}}
		}
		return {status: 200, message: {message: "Successfully logged in"}}
	}

	async getDebugToken(){
		return {status: 200, message: {data: await new AuthUtil().getDebugToken()}}
	}

	async login(data){
		let isAlreadyLoggedin = await new AuthUtil().checkAuth(data.auth)
		if(isAlreadyLoggedin){
			return {status: 403, message: {message: "Already logged in"}}
		}

		if(!data.body.email || !data.body.password){
			return {status: 406, message: {error: "Invalid data"}}
		}

		let resp = await new AuthUtil().login(data.body);
		if(resp.error){
			return {status: 403, message: {message: "Invalid Credentials",error: resp.error}}
		}
		return {status: 200, message: {message: "loggedin",data: resp}}
	}

}