const getSince = require("../helpers/getSince");
const { User, Profile, Tweet, Mutual } = require('../models/index');

class Controller {
	static home (req, res) {
		const id = req.session.userId;
		let dataUser;
		User.findByPk(id, {include: {
			model: Profile}})
		.then(data => {
			dataUser = data
			return Tweet.findAll({
				include: {
					model: User,
					include: {
						model: Profile
					}
				}
			})
		})
		.then(data => {
			console.log(data);
			console.log(dataUser);
			res.render('home', { dataUser, data, getSince })
		}) // tweet findall include user, user include mutual,
		.catch(err => {
			console.log(err);
			res.send(err)
		})
	}
}

module.exports = {
	Controller
};
