var keystone = require('keystone');
var Path = keystone.list('Path');
var Place = keystone.list('Place');
var Objects = keystone.list('Object');
var Goals = keystone.list('Goal');
var async = require('async');


function changelang(item, lang){
	if(lang=='en'){
		if(item.init_content_en){
			item.init_content = item.init_content_en;
		}
		if(item.success_content_en){
			item.success_content = item.success_content_en;
		}
		if(item.name_en){
			item.name=item.name_en;
		}
	}
	
	return item;
}
exports = module.exports = function(req, res) {
	var ret = {
		path:{},
		places:[],
		objects:[],
		goals:[],
		is_editable: false
	};

	var lang = "";
	if(req.user && req.user.language=='en'){
		lang='en'
	}

	Path.model.findOne()
	.where('key', req.query.key)
	.populate('author', 'name avatar')
	.populate('init_content success_content init_content_en success_content_en')
	.exec(function(err, path){
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

			ret.path = changelang(path,lang);
			

			async.parallel([
				function(callback){
					Place.model.find({
						'_id':{$in: places}
					}).populate('init_content')
					.populate('success_content')
					.populate('init_content_en')
					.populate('success_content_en')
					.exec(function(err2,tmp_places){
						places=[];
						tmp_places.forEach(function(place){
							places.push(changelang(place,lang));
						});
						ret.places = (places);
						callback();
					});
				},
				function(callback){
					Objects.model.find({
						'_id':{$in: objects}
					}).populate('init_content')
					.populate('success_content')
					.populate('init_content_en')
					.populate('success_content_en')
					.exec(function(err3,tmp_objects){
						objects=[];
						tmp_objects.forEach(function(object){
							objects.push(changelang(object,lang));
						});
						ret.objects = (objects);
						callback();
					});	
				},
				function(callback){
					Goals.model.find({
						'parent': path._id
					}).exec(function(err3,tmp_goals){
						goals=[];
						tmp_goals.forEach(function(goal){
							goals.push(changelang(goal,lang));
						});
						ret.goals = (goals);
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