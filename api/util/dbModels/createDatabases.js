const DBUtil = require("../DBUtil")
const fs = require("fs")


async function createDBs(){

	console.log("Creating databases...")
	let database = fs.readFileSync("./database.sql", "utf8")
	await new DBUtil().query(database)
	let orderstable = fs.readFileSync("./orders.sql", "utf8")
	await new DBUtil().query(orderstable)
	let userstable = fs.readFileSync("./users.sql", "utf8")
	await new DBUtil().query(userstable)
	console.log("Databases created")

}
createDBs()