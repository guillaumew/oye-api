var keystone = require('keystone');
var Path = keystone.list('Path');

exports = module.exports = function(req, res) {
	Path.model.find()
	.where('is_available', true)
	.populate('author', 'name avatar')
	.exec(function(err, paths){
		if (err) {
			return res.json(err);
		} else {
			res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
			res.setHeader('Access-Control-Allow-Methods', 'GET');
			res.setHeader('Access-Control-Allow-Credentials', true);	
			return res.json(paths);
		}
	});
}