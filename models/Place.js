var keystone = require('keystone');
var Types = keystone.Field.Types;
var Item = keystone.list('Item');


/**
 * Place Model
 * ==========
 */
var Place = new keystone.List('Place',{inherits: Item});

Place.add({
	name: { type: Types.Text, required: true, index: true },
	longitude: { type: Types.Number },
	latitude: { type: Types.Number },
});


/**
 * Registration
 */
Place.defaultColumns = 'name';
Place.register();