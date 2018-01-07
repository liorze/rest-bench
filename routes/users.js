var express = require('express');
var router = express.Router();
var fs = require('fs');
console.log('READING FILE: ' + process.argv[2]);
var obj = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var randomInt = require('random-int');
var jwt = require('jsonwebtoken');

var mapping = new Map();

for (let i = 0; i < 10000; ++i) mapping.set(i, obj);

/* GET users listing. */
router.get('/', (req, res) => {
	jwt.verify(req.query.token, 'f123984c-3c67-4a24-b84d-1e3c7fa03f14', (err, decoded) => {
		if (err) {
			console.error(err);
			res.sendStatus(403);
			return;
		}

		res.status(200);
		res.json(mapping.get(randomInt(10000)));	
	});
});

module.exports = router;
