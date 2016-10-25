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
	.where('_id', req.headers.id)
	.populate('author')
	.populate('init_content')
	.populate('success_content')
	.exec(function(err, path){
		if (err) {
			return res.json(err);
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
						ret.places.push(place);
						callback();
					});
				},
				function(callback){
					Objects.model.find({
						'_id':{$in: objects}
					}).populate('init_content')
					.populate('success_content')
					.exec(function(err3,object){
						ret.objects.push(object);
						callback();
					});	
				}
			], function(err){
				return res.json(ret);
			});
		}
	});
	
}