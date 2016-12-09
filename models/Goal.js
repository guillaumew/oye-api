var keystone = require('keystone');

var Types = keystone.Field.Types;

/**
 * Goal Model
 * ==========
 */
var Goal = new keystone.List('Goal');

Goal.add({
	name: { type: Types.Text, required: true, index: true },
	parent: {type: Types.Relationship, ref: 'Path', many: false},
	type: { 
		type: Types.Select,
		options: 'primary, secondary',
		emptyOption: false,
		required: true,
		default: 'primary'
	},

}, 'Success conditions', {
	success_objects: {type: Types.Relationship, ref: 'Object', many: true},
	success_place: {type: Types.Relationship, ref: 'Place', many: true},
	open_objects: {type: Types.Relationship, ref: 'Object', many: true},
	open_place: {type: Types.Relationship, ref: 'Place', many: true},
});


/**
 * Registration
 */
Goal.defaultColumns = 'name';
Goal.register();