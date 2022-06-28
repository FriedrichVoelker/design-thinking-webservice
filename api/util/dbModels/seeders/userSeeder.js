const UserUtil = require("../../UserUtil.js");

const users = [
	{
		email: "admin@test.dev",
		password: "admin",
		name: "admin"
	},
	{
		email: "user@test.dev",
		password: "user",
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