const getSince = require("../helpers/getSince");
const { User, Profile, Tweet, Mutual } = require('../models/index');

class Controller {
	static home (req, res) {
		Tweet.findAll({
			include: {
				model: User
			}
		})
		.then(data => {
			res.send(data)
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
