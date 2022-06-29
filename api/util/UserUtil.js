const DBUtil = require("./DBUtil");
const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports = class UserUtil {
	addUser(data){
		return new Promise((resolve, reject) => {

		if(!data.name || !data.email || !data.password){
			return {error: "Missing data"}
		}

		let created_at = new Date();

		data.password = bcrypt.hashSync(data.password, saltRounds);

			new DBUtil().query("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)", [data.name, data.email, data.password, created_at])
			.then(result => {
				console.log(result)
				resolve({success: true})
			}).catch(err => {
				resolve({error: err})
			})
		})

	}
	getUsers(){
		return new Promise((resolve, reject) => {
			new DBUtil().query("SELECT name, email, created_at FROM users")
			.then(result => {
				resolve({result: result})
			}).catch(err => {
				resolve({error: err})
			})
		})
	}
	deleteUser(email){
		return new Promise((resolve, reject) => {
			new DBUtil().query("DELETE FROM users WHERE email = ?", [email])
			.then(result => {
				resolve({result: result})
			}).catch(err => {
				resolve({error: err})
			})
		})
	}


	settings(data){
		return new Promise(async (resolve, reject) => {
			let hashedpw = bcrypt.hashSync(data.new_password, saltRounds);
			let queries = ""
			let params = []
			if(data.new_email){
				queries += "email = ?" + (data.new_password ? ", " : "");
				params.push(data.new_email)
			}
			if(data.new_password){
				queries += "password = ?" + (data.new_name ? ", " : "");
				params.push(hashedpw)
			}
			if(data.new_name){
				queries += "name = ?"
				params.push(data.new_name)
			}
			
			if(queries.length == 0){
				return resolve({error: "No data to update"})
			}


			params.push(data.email)
			console.log(params)
			await new DBUtil().query("UPDATE users SET "+queries+" WHERE email = ?", params)
			.then(async result => {
				let user = await new DBUtil().query("SELECT * FROM users WHERE email = ?", [data.new_email]);
				console.log(user)
				let userData = {
					name: user[0].name,
					email: user[0].email,
					created: user[0].created_at,
				}
				console.log(userData)
				resolve({result: userData})
			}).catch(err => {
				resolve({error: err})
			})
		})
	}
}