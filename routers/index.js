const express = require('express');
const router = express.Router()
const { Controller } = require('../controllers/controller.js');

router.get('/', (req, res) => {
	res.send('annyeong')
})

module.exports = router;

// user role
// 1. ngetweet wkwk (C)
// 2. liat all tweet di timeline (R)
// 3. see tweet detail (R)
// 4. delete tweet (D)
// 5. liat profile sendiri (R)
// 6. edit profile sendiri (U)
// 7. liat profile orang (R)
// 8. liat all tweet orang (R)

// admin role
// 1. make user official/centang biru (U)
// 2. delete user (D)

// user 
// 1. login (R)
// 2. register (C)


