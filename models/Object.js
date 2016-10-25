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
		type: Types.LocalFile, 
		dest: 'public/path_files', 
		required: false,
		format: function(item, file){
			return '<img src="/object_files/'+file.filename+'" style="width: 100px; height:100px;">'
		}
	},
});


/**
 * Registration
 */
Object.defaultColumns = 'name';
Object.register();