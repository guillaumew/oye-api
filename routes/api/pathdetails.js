var keystone = require('keystone');
var Path = keystone.list('Path');
var Place = keystone.list('Place');
var Objects = keystone.list('Object');
var async = require('async');

exports = module.exports = function(req, res) {
	var ret = {
		path:{},
		places:[],
		objects:[]
	};
	Path.model.findOne()
	.where('key', req.query.key)
	.populate('author')
	.populate('init_content')
	.populate('success_content')
	.exec(function(err, path){
		if (err) {
			return res.json(err);
		} else if(!path) {
			return res.json(ret);
		} else {
			ret.path = path;
			var places = path.places;
			var objects = path.objects;

			async.parallel([
				function(callback){
					Place.model.find({
						'_id':{$in: places}
					}).populate('init_content')
					.populate('success_content')
					.exec(function(err2,place){
						ret.places = (place);
						callback();
					});
				},
				function(callback){
					Objects.model.find({
						'_id':{$in: objects}
					}).populate('init_content')
					.populate('success_content')
					.exec(function(err3,object){
						ret.objects = (object);
						callback();
					});	
				}
			], function(err){
				res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
				res.setHeader('Access-Control-Allow-Methods', 'GET');
				res.setHeader('Access-Control-Allow-Credentials', true);	
				return res.json(ret);
			});
		}
	});
	
}