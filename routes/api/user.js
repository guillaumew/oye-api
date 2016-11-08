var keystone = require('keystone');

exports = module.exports = function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if(req.user){

		return res.json(req.user);
	}else{
		return res.json({error : "not logged"});
	}
	
}