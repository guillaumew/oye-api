var keystone = require('keystone');
var Path = keystone.list('Path');
var Place = keystone.list('Place');
var Objects = keystone.list('Object');
var Content = keystone.list('Content');
var Image = keystone.list('Image')
var Goals = keystone.list('Goal');
var async = require('async');
var objects=[];
var places=[];
var lang = "";

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

function getImages(item,cb){
	var tmp_item = item;
	async.eachSeries(
		['init_content', 'success_content', 'init_content_en' ,'success_content_en'],
		function(content_name, cback){
			Content.model.findOne({
				'_id': item[content_name]
			}).populate('images')
			.exec(function(err4,content){
				tmp_item[content_name] = content;
				cback();
			});	
		}
	,function(){
		if (item.__t === 'Place'){
			places.push(changelang(tmp_item,lang));
		}else{
			objects.push(changelang(tmp_item,lang));
		}
		cb();
	})
}

exports = module.exports = function(req, res) {
	var ret = {
		path:{},
		places:[],
		objects:[],
		goals:[],
		is_editable: false
	};

	if(req.user && req.user.language=='en'){
		lang='en'
	}
	if(req.query.language){
		lang = req.query.language;
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
			if(req.user && req.user['_id'].toString() == path.author['_id'].toString()){
				ret.is_editable = true ;
			}

			ret.path = changelang(path,lang);
			

			async.parallel([
				function(callback){
					Place.model.find({
						'_id':{$in: path.places}
					}).populate('init_content success_content init_content_en success_content_en')
					.exec(function(err2,tmp_places){
						async.eachSeries(tmp_places, getImages, function done(){
							ret.places = (places);
							callback();
						});
					});
				},
				function(callback){
					Objects.model.find({
						'_id':{$in: path.objects}
					}).populate('init_content success_content init_content_en success_content_en')
					.exec(function(err3,tmp_objects){
						async.eachSeries(tmp_objects, getImages, function done(){
							ret.objects = (objects);
							callback();
						});
					});	
				},
				function(callback){
					Goals.model.find({
						'parent': path._id
					}).exec(function(err5,tmp_goals){
						var goals=[];
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
				return res.json(ret);
			});
		}
	});
	
}