var keystone = require('keystone');

var Types = keystone.Field.Types;
var Item = keystone.list('Item');

/**
 * Object Model
 * ==========
 */
var Object = new keystone.List('Object',{inherits: Item});

Object.add({
	name: { type: Types.Text, required: true, index: true },
	thumb: { 
		type: Types.S3File
	},
});


/**
 * Registration
 */
Object.defaultColumns = 'name';
Object.register();