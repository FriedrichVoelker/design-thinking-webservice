const UserUtil = require("../../UserUtil.js");

const users = [
	{
		email: "admin@solar.panels",
		password: "admin@solar.panels",
		name: "admin"
	},
	{
		email: "user@solar.panels",
		password: "user@solar.panels",
		name: "user"
	},
];

async function seedUsers() {
		console.log("Staring userseeder")
		users.forEach(async user => {
			await new UserUtil().addUser(user)
		});
		console.log("Users seeded");
		return;
}
seedUsers()