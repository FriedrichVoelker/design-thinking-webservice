const OrderUtil = require("../../OrderUtil.js");

const orders = [
	{
		amount: 22,
		email: "test@example.com",
		name: "Test"
	},
	{
		amount: 3,
		email: "john@doe.com",
		name: "John Doe"
	},
	{
		amount: 4,
		email: "jane@doe.com",
		name: "Jane Doe"
	},
	{
		amount: 1,
		email: "bitcoinbro@yahoo.mail",
		name: "Chad Brathwaite"
	},
	{
		amount: 13,
		email: "iLikeSolar@gmail.com",
		name: "Gregory Smith"
	},
	{
		amount: 157,
		email: "SolarEntrepeneuer@ceo.rich",
		name: "Melon Usk"
	}
];

async function seedOrders() {
		console.log("Staring orderseeder")
		orders.forEach(async order => {
			await new OrderUtil().addOrder(order)
		});
		console.log("Orders seeded");
		return;
}
seedOrders()