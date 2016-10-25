var keystone = require('keystone');
var Path = keystone.list('Path');

exports = module.exports = function(req, res) {
	Path.model.find()
	.populate('author')
	.exec(function(err, paths){
		if (err) {
			return res.json(err);
		} else {
			return res.json(paths);
		}
	});
}