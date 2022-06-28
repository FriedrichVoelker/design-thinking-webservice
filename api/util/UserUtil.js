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
}