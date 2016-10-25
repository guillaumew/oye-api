var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Item Model
 * ==========
 */
var Item = new keystone.List('Item');

Item.add({
	init_content : { type: Types.Relationship, ref: 'Content' },
	success_content : { type: Types.Relationship, ref: 'Content' },
	success_condition: { 
		type: Types.Select, 
		emptyOption: true, 
		options: 'object, occurence, password'
	},
	success_key: { type: Types.Text },
	places_on_open : { type: Types.Relationship, ref: 'Place', many: true },
	places_on_success : { type: Types.Relationship, ref: 'Place', many: true },
	objects_on_open : { type: Types.Relationship, ref: 'Object', many: true },
	objects_on_success : { type: Types.Relationship, ref: 'Object', many: true },
});


/**
 * Registration
 */
Item.defaultColumns = 'name';
Item.register();