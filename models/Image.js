var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Content Model
 * ==========
 */
var Image = new keystone.List('Image');

Image.add({
	name: { type: Types.Text, required: true, index: true },
	description: {type: Types.Html, wysiwyg: true},
	media : { 
		type: Types.S3File
	}
});
Image.relationship({path: 'contents', ref: 'Content', refPath: 'images'});

/**
 * Registration
 */
Image.defaultColumns = 'name';
Image.register();