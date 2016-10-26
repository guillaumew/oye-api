var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Path Model
 * ==========
 */
var Path = new keystone.List('Path');

Path.add({
	name: { type: Types.Text, required: true, index: true },
	thumb: { 
		type: Types.LocalFile, 
		dest: 'public/path_files', 
		required: false,
		format: function(item, file){
			return '<img src="/path_files/'+file.filename+'" style="width: 100px; height:100px;">'
		}
	},
	author: { type: Types.Relationship, ref: 'Y' },
	places: { type: Types.Relationship, ref: 'Place', many: true },
	objects: { type: Types.Relationship, ref: 'Object', many: true },
	longitude: { type: Types.Number },
	latitude: { type: Types.Number },
	init_places: { type: Types.Relationship, ref: 'Place', many: true },
	init_objects: { type: Types.Relationship, ref: 'Object', many: true },
	init_content: { type: Types.Relationship, ref: 'Content' },
	success_content: { type: Types.Relationship, ref: 'Content' },
	key: { type: Types.Key },
});


/**
 * Registration
 */
Path.defaultColumns = 'name, thumb';
Path.register();
