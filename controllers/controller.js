const { Op } = require("sequelize");
const getSince = require("../helpers/getSince");
const { User, Profile, Tweet, Mutual } = require('../models/index');

class Controller {
	static home (req, res) {
		const id = req.session.userId;
		const tweet = req.query.tweet;
		const errors = req.query.errors?JSON.parse(req.query.errors):'';
    
		let dataUser;
		let options = {
			include: {
				model: User,
				include: {
					model: Profile
				}
			},
			where: {},
			order: [['createdAt', 'desc']]
		}

		if (tweet) {
			options.where = {
				tweet: {
					[Op.iLike]: `%${tweet}%`
				}
			}
		}

		User.findByPk(id, {include: {
			model: Profile}})
		.then(data => {
			dataUser = data
			return Tweet.findAll(options)
		})
		.then(data => {
			res.render('home', { dataUser, data, getSince, id, errors })
		}) // tweet findall include user, user include mutual,
		// let tweets;
		// Tweet.findAll({
		// 	include: {
		// 		model: User,
		// 		include: {
		// 			model: Profile
		// 		}
		// 	},
		// 	order: [['updatedAt', 'desc']]
		// })
		// .then(data => {
			
		// })
		.catch(err => {
			// console.log(err);
			res.send(err)
		})
	}
	static game(req, res) {
		res.render('game')
	}
	static newTweet (req, res) {
		const UserId = req.session.userId;
		const { tweet, imageURL } = req.body
		Tweet.create({ tweet, imageURL, UserId })
		.then(data => {
			res.redirect('/tweets')
		})
		.catch(err => {
			if (err.name === 'SequelizeValidationError') {
				const errors = {}
				err.errors.forEach(el => {
					errors[el.path] = el.message
				})
				res.redirect(`/tweets?errors=${JSON.stringify(errors)}`)
			} else {
				res.send(err)
			}
		})
	}
	static deleteTweet (req, res) {
		const id = req.params.id;
		Tweet.destroy({ where: { id } })
		.then(data => {
			res.redirect('/tweets')
		})
		.catch(err => {
			// console.log(err);
			res.send(err)
		})
	}
	static formEditTweet (req, res) {
		const sesId = req.session.userId;
		const id = req.params.id;
		const errors = req.query.errors?JSON.parse(req.query.errors):'';
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
			res.render('tweet-edit', { dataUser, tweet, errors, sesId})
		})
		.catch(err => {
			console.log(err);
			res.send(err)
		})
	}
	static editTweet (req, res) {
		const id = req.params.id;
		const { tweet, imageURL } = req.body.tweet
		// console.log(tweet, 'tweet');
		Tweet.update({ tweet, imageURL }, { where: { id } })
		.then(data => {
			res.redirect('/tweets')
		})
		.catch(err => {
			if (err.name === 'SequelizeValidationError') {
				const errors = {}
				err.errors.forEach(el => {
					errors[el.path] = el.message
				})
				res.redirect(`/tweets/${id}/edit?errors=${JSON.stringify(errors)}`)
			} else {
				res.send(err)
			}
		})
	}
	static detailTweet (req, res) {
		const sesId = req.session.userId;
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
			res.render('tweet-detail', { dataUser, tweet, sesId })
		})
		.catch(err => {
			console.log(err);
			res.send(err)
		})
	}
	static like(req, res) {
		const id = req.params.id
		Tweet.increment('likes', { where: { id } })
		.then(data => {
			res.redirect(`/tweets`)
		})
		.catch(err => {
			// console.log(err);
			res.send(err)
		})
	}
}

module.exports = {
	Controller
};
