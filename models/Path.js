var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Path Model
 * ==========
 */
var Path = new keystone.List('Path',
	{autokey: { path: 'key', from: 'name', unique: true }});

Path.add({
	name: { type: Types.Text, required: true, index: true },
	thumb: { 
		type: Types.S3File
	},
	author: { type: Types.Relationship, ref: 'Y' },
	places: { type: Types.Relationship, ref: 'Place', many: true },
	longitude: { type: Types.Number },
	latitude: { type: Types.Number },
	objects: { type: Types.Relationship, ref: 'Object', many: true },
	longitude: { type: Types.Number },
	latitude: { type: Types.Number },
	init_places: { type: Types.Relationship, ref: 'Place', many: true, filters: { path: ':_id' } },
	init_objects: { type: Types.Relationship, ref: 'Object', many: true, filters: { path: ':_id' } },
	init_content: { type: Types.Relationship, ref: 'Content', filters: { parent: ':_id' }, many: false },
	key: { type: Types.Key },
});


/**
 * Registration
 */
Path.defaultColumns = 'name, thumb';
Path.register();
