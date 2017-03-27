var keystone = require('keystone');
var Types = keystone.Field.Types;
var Item = keystone.list('Item');


/**
 * Place Model
 * ==========
 */
var Place = new keystone.List('Place',{inherits: Item});

Place.add({
	longitude: { type: Types.Number },
	latitude: { type: Types.Number },
});
Place.relationship({path: 'paths', ref: 'Path', refPath: 'places'});

/**
 * Registration
 */
Place.defaultColumns = 'name';
Place.register();