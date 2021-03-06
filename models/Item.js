var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Item Model
 * ==========
 */
var Item = new keystone.List('Item');

Item.add({
	name: { type: Types.Text, required: true, index: true },
	name_en: { type: Types.Text, required: false },
	init_content : { type: Types.Relationship, ref: 'Content' },
	success_content : { type: Types.Relationship, ref: 'Content' },
	
	init_content_en : { type: Types.Relationship, ref: 'Content' },
	success_content_en : { type: Types.Relationship, ref: 'Content' },

	success_condition: { 
		type: Types.Select, 
		emptyOption: true, 
		options: 'object, occurence, password, place'
	},
	success_key: { type: Types.Text },
	places_on_open : { type: Types.Relationship, ref: 'Place', many: true },
	places_on_success : { type: Types.Relationship, ref: 'Place', many: true },
	objects_on_open : { type: Types.Relationship, ref: 'Object', many: true },
	objects_on_success : { type: Types.Relationship, ref: 'Object', many: true },
	parent: {type: Types.Relationship, ref: 'Path', many: false},
});

/**
 * Registration
 */
Item.defaultColumns = 'name';
Item.register();