const DBUtil = require("./DBUtil");

module.exports = class OrderUtil {
	addOrder(data){
		
		return new Promise((resolve, reject) => {
			if(!data.amount || !data.email || !data.name){
				return {error: "Missing data"}
			}
	
			let date = new Date();
	
				new DBUtil().query("INSERT INTO orders (amount, name, email, date) VALUES (?, ?, ?, ?)", [data.amount, data.name, data.email, date])
				.then(result => {
					console.log(result)
					resolve({success: true})
				}).catch(err => {
					resolve({error: err})
				})
			})
	}

	getOrders(){
		return new Promise((resolve, reject) => {
			new DBUtil().query("SELECT * FROM orders")
			.then(result => {
				resolve({result: result})
			}).catch(err => {
				resolve({error: err})
			})
		})
	}

	acceptOrder(id){
		return new Promise((resolve, reject) => {
			new DBUtil().query("UPDATE orders SET accepted = 1 WHERE id = ?", [id])
			.then(result => {
				resolve({success: true})
			}).catch(err => {
				resolve({error: err})
			})
		})
	}

	deleteOrder(id){
		return new Promise((resolve, reject) => {
			new DBUtil().query("DELETE FROM orders WHERE id = ?", [id])
			.then(result => {
				resolve({success: true})
			}).catch(err => {
				resolve({error: err})
			})
		})
	}

}