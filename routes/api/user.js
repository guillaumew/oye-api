var keystone = require('keystone');

exports = module.exports = function(req, res) {
	if(req.user){
		return res.json(req.user);
	}else{
		return res.json({error : "not logged"});
	}
	
}