const jwt = require("jsonwebtoken")
const DBUtil = require("./DBUtil")


const secret = "SECRET";

const bcrypt = require("bcrypt");

const saltRounds = 10;

const users = [
	{
		id: 1,
		email: "test@mail.de",
		name: "admin",
		password: "admin",
		role: "admin",
	}
]

module.exports = class AuthUtil {
	
	checkAuth(data){
		return new Promise((resolve, reject) => {
			let token = data;
			if(token == null){
				resolve(false)
				return;
			}

			if(token.includes("Bearer ")){
				token = token.split("Bearer ")[1];
			}
			jwt.verify(token, secret, function(err, decoded) {
				if(err){
					resolve(false)
				}
				resolve(true)
			})
		})
	}

	getDebugToken(){

		let data = {
			id: 1,
			username: "admin",
			email: "",
			role: "admin"
		}

		return jwt.sign({data}, secret, {expiresIn: "1h"});
	}
	decodeToken(data){
		return new Promise((resolve, reject) => {
			let token = data;
			if(token.includes("Bearer ")){
				token = token.split("Bearer ")[1];
			}
			jwt.verify(token, secret, function(err, decoded) {
				if(err){
					resolve({error: "Invalid token"})
				}
				resolve({decoded: decoded})
			})
		})
	}

	login(data){
		return new Promise(async (resolve, reject) => {
			let email = data.email;
			let password = data.password;
			if(!email || !password){
				resolve({error: "Invalid data"})
				return;
			}

			const user = await new DBUtil().query("SELECT * FROM users WHERE email = ?", [email]);
			if(!user){
                return resolve({error: "error Wrong Password"});
			}

			if (!bcrypt.compareSync(data.password, user[0].password)){
                return resolve({error: "error Wrong Password"});
			}
				let userData = {
					name: users[0].name,
					email: users[0].email,
					created: users[0].created_at,
				}

				resolve({token: jwt.sign({data: userData}, secret, {expiresIn: "1d"}), user: userData})
		})
	}

}