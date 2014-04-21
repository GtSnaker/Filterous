/*
 *  Predefined filter effects with names for Filterous.js
 *
 *  Last modified: March 1, 2014
 */

// Prepare image-layer effects
Filterous = require('./filterous').Filterous

var rockstarLayer = new Image();
rockstarLayer.src = './effects/bokeh-stars.png';


// Define named effects
exports.reset = function(img, format) {
	var f = new Filterous(img, format);
	f.reset();
};
exports.fluorescent = function(img, format) {
	// Warm, saturated tones with an emphasis on yellow
	var f = new Filterous(img, format);
	f.filterImage('rgbAdjust', [1, 1.2, 1.4]);
	f.filterImage('brightness', 10);
	f.render();
};
exports.nostalgia = function(img, format) {
	// Slightly blurred, with sepia tone
	var f = new Filterous(img, format);
	f.filterImage('rgbAdjust', [1.4, 1.2, 1]);
	f.filterImage('convolute',
		[ 0.1, 0.1, 0.1,
		  0.1, 0.1, 0.1,
		  0.1, 0.1, 0.1 ]
	);
	f.render();
};
exports.phykos = function(img, format) {
	// Slightly blurred, with yellow and green saturated
	var f = new Filterous(img, format);
	f.filterImage('rgbAdjust', [1, 1.1, 1.1]);
	f.filterImage('convolute',
		[ 0.1, 0.1, 0.1,
		  0.1, 0.1, 0.1,
		  0.1, 0.1, 0.1 ]
	);
	f.render();
};
exports.lotus = function(img, format) {
	// Sepia-like, with an emphasis on purples and browns
	var f = new Filterous(img, format);
	f.filterImage('rgbAdjust', [1.4, 1.15, 1.1]);
	f.render();
};
exports.memphis = function(img, format) {
	// Sharp images with a magenta-meets-purple tint
	var f = new Filterous(img, format);
	f.filterImage('rgbAdjust', [1.2, 1, 1.1]);
	f.filterImage('convolute',
		[ 0, -1,  0,
		 -1,  5, -1,
		  0, -1,  0 ]
	);
	f.render();
};
exports.deutlich = function(img, format) {
	// High exposure
	var f = new Filterous(img, format);
	f.filterImage('convolute',
		[ 0, 0, 0,
		  0, 1.3, 0,
		  0, 0, 0 ]
	);
	f.render();
};
exports.sumie = function(img, format) {
	var f = new Filterous(img, format);
	f.filterImage('grayscale');
	f.render();
};
exports.rockstar = function(img, format) {
	// applying a starry layer
	var f = new Filterous(img, format);
	f.applyLayer(rockstarLayer);
	f.render();
};
exports.blur = function(img, format) {
	var f = new Filterous(img, format);
	f.filterImage('convolute',
		[ 1/9, 1/9, 1/9,
	    1/9, 1/9, 1/9,
	    1/9, 1/9, 1/9 ]

	);
	f.render();
};
exports.sharpen = function(img, format) {
	var f = new Filterous(img, format);
	f.filterImage('convolute',
		[  0, -1,  0,
	    -1,  5, -1,
	     0, -1,  0 ]

	);
	f.render();
};
exports.sepia = function(img, format) {
	// High exposure
	var f = new Filterous(img, format);
	f.filterImage('grayscale');
	f.filterImage('sepia');
	f.render();
};
