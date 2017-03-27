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
	name_en: { type: Types.Text, required: false },
	thumb: { 
		type: Types.S3File
	},
	author: { type: Types.Relationship, ref: 'User' },
	places: { type: Types.Relationship, ref: 'Place', many: true },
	longitude: { type: Types.Number },
	latitude: { type: Types.Number },
	objects: { type: Types.Relationship, ref: 'Object', many: true },
	longitude: { type: Types.Number },
	latitude: { type: Types.Number },
	init_places: { type: Types.Relationship, ref: 'Place', many: true, filters: { path: ':_id' } },
	init_objects: { type: Types.Relationship, ref: 'Object', many: true, filters: { path: ':_id' } },
	init_content: { type: Types.Relationship, ref: 'Content', filters: { parent: ':_id' }, many: false },
	success_content: { type: Types.Relationship, ref: 'Content', filters: { parent: ':_id' }, many: false },
	init_content_en: { type: Types.Relationship, ref: 'Content', filters: { parent: ':_id' }, many: false },
	success_content_en: { type: Types.Relationship, ref: 'Content', filters: { parent: ':_id' }, many: false },
	type: { 
		type: Types.Select,
		options: 'walk, inquiry, hunt',
		emptyOption: false,
		required: true,
		default: 'walk'
	},
	language: { 
		type: Types.Select,
		options: 'FR, EN',
		emptyOption: false,
		required: true,
		default: 'FR'
	},
	length : {type: Types.Number },
	city: { type: Types.Text},
	is_available:{ type: Types.Boolean, default: false },
	key: { type: Types.Key },
});
Path.relationship({path: 'goals', ref: 'Goal', refPath: 'parent'});
Path.relationship({path: 'places', ref: 'Place', refPath: 'parent'});
Path.relationship({path: 'objects', ref: 'Object', refPath: 'parent'});
/**
 * Registration
 */
Path.defaultColumns = 'name, thumb';
Path.register();
