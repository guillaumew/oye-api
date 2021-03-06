var keystone = require('keystone');

var Types = keystone.Field.Types;
var Item = keystone.list('Item');

/**
 * Object Model
 * ==========
 */
var Object = new keystone.List('Object',{
	inherits: Item
});

Object.add({
	thumb: { 
		type: Types.S3File
	},
});
Object.relationship({path: 'paths', ref: 'Path', refPath: 'objects'});


/**
 * Registration
 */
Object.defaultColumns = 'name';
Object.register();