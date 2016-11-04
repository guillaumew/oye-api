var keystone = require('keystone');
var Object = keystone.list('Object');
var Place = keystone.list('Place');
var Content = keystone.list('Content');
var Path = keystone.list('Path');
var async = require('async');


exports = module.exports = function(req, res) {
	if(req.query.name){
		var name = req.query.name;
		var data = {name:name};
	}else{
		return res.sendStatus(400);
	}

	if(req.query.type){
		switch (req.query.type){
			case 'object':
				var item = new Object.model();
				break;
			case 'place':
				var item = new Place.model();
				if(req.query.latitude){
					data.latitude = req.query.latitude;
				}
				if(req.query.longitude){
					data.longitude = req.query.longitude;
				}
				break;
			default :
				return res.sendStatus(400);
		}
	}else{
		return res.sendStatus(400);
	}

	var path;

	async.series([
		function(next){
			if(req.query.path_id){
				Path.model.findById(req.query.path_id).exec(function(err,found_path){
					if(!found_path){
						return res.sendStatus(404);
					}
					path = found_path;
					next();
				});
			}else{
				return res.sendStatus(400);
			}			
		},
		function(next){
			if(!req.user || req.user['_id'].toString() != path.author.toString()){;
				return res.sendStatus(401);
			}else{
				next();
			}	
		}
	],function(){

		async.parallel([
			function(callback){
				var init_content = new Content.model();
				init_content.getUpdateHandler(req).process({name:name+" - init_content"},function(){
					if(init_content['_id']){
						data.init_content = init_content['_id'];
					}
					callback();
				});
			},
			function(callback){
				var success_content = new Content.model();
				success_content.getUpdateHandler(req).process({name:name+" - success_content"},function(){
					if(success_content['_id']){
						data.success_content = success_content['_id'];
					}
					callback();
				});
			}
		],function(){
			item.getUpdateHandler(req).process(data, function(err1) {
				if(err1){return res.sendStatus(500);}

				path[req.query.type+"s"].push(item['_id']);

				path.getUpdateHandler(req).process(path,function(err2){
					if(err2){return res.sendStatus(500);}
					res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
					res.setHeader('Access-Control-Allow-Methods', 'POST');
					res.setHeader('Access-Control-Allow-Credentials', true);
					res.send(item);
				});
				
			});
		});

	});


}