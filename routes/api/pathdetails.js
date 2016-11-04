var keystone = require('keystone');
var Path = keystone.list('Path');
var Place = keystone.list('Place');
var Objects = keystone.list('Object');
var async = require('async');

exports = module.exports = function(req, res) {
	var ret = {
		path:{},
		places:[],
		objects:[],
		is_editable: false
	};
	Path.model.findOne()
	.where('key', req.query.key)
	.populate('author', 'name avatar')
	.populate('init_content success_content')
	.exec(function(err, path){
		path['is_editable'] = false;
		if (err) {
			return res.json(err);
		} else if(!path) {
			return res.json(ret);
		} else {
			var places = path.places;
			var objects = path.objects;
			if(req.user && req.user['_id'].toString() == path.author['_id'].toString()){
				ret.is_editable = true ;
			}
			
			ret.path = path;
			

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
				console.log(ret.is_editable);
				return res.json(ret);
			});
		}
	});
	
}