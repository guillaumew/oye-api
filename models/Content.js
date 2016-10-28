var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Content Model
 * ==========
 */
var Content = new keystone.List('Content');

Content.add({
	name: { type: Types.Text, required: true, index: true },
	media_type: { 
		type: Types.Select, 
		emptyOption: false, 
		options: 'img, audio, video, group, youtube, iframe, none'
	},
	description: {type: Types.Html, wysiwyg: true},
	media : { 
		type: Types.S3File
	},
	media_url: {type: Types.Url},
	sub_objects : { type: Types.Relationship, ref: 'Object', many: true },
});


/**
 * Registration
 */
Content.defaultColumns = 'name';
Content.register();