var keystone = require('keystone');
var Path = keystone.list('Path');

exports = module.exports = function(req, res) {
	var conditions = [{is_available: true}];
	if(req.user){
		conditions.push({"author" : req.user['_id'].toString()});
	}
	var lang='';
	if(req.user && req.user.language=='en'){
		lang='en'
	}
	if(req.query.language =='en'){
		lang = req.query.language;
	}

	Path.model.find({$or:conditions})
	.populate('author', 'name avatar')
	.exec(function(err, paths){
		if (err) {
			return res.json(err);
		} else {
			if(lang=='en'){
				paths.forEach(function(path){
					if(path.name_en){
						path.name=path.name_en;
					}
				})
			}
			res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
			res.setHeader('Access-Control-Allow-Methods', 'GET');
			res.setHeader('Access-Control-Allow-Credentials', true);	
			return res.json(paths);
		}
	});
}