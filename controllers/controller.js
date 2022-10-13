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
				},
				order: [['createdAt', 'desc']]
			})
		})
		.then(data => {
			res.render('home', { dataUser, data, getSince })
		}) // tweet findall include user, user include mutual,
		.catch(err => {
			console.log(err);
			res.send(err)
		})
	}
	static newTweet (req, res) {
		const UserId = req.session.userId;
		const { tweet, imageURL } = req.body
		Tweet.create({ tweet, imageURL, UserId })
		.then(data => {
			res.redirect('/tweets')
		})
		.catch(err => {
			console.log(err);
			res.send(err)
		})
	}
	static deleteTweet (req, res) {
		// const id = req.session.userId;
		const id = req.params.id;
		Tweet.destroy({ where: { id } })
		.then(data => {
			res.redirect('/tweets')
		})
		.catch(err => {
			console.log(err);
			res.send(err)
		})
	}
	static detailTweet (req, res) {
		// const id = req.session.userId;
		const id = req.params.id;
		let tweet;
		Tweet.findByPk(id)
		.then(data => {
			tweet = data
			return User.findByPk(data.UserId, {
				include: {
					model: Profile
				}
			})
		})
		.then(dataUser => {
			console.log(dataUser, tweet, "===============");
			res.render('tweet-detail', { dataUser, tweet})
		})
		.catch(err => {
			console.log(err);
			res.send(err)
		})
	}
}

module.exports = {
	Controller
};
