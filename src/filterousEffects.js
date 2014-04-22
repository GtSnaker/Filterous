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

exports.saturation = function(img, format){
	var f = new Filterous(img, format);
	f.filterImage('saturation', 2);
	f.render();
};

exports.hyperSaturation = function(img, format){
	var f = new Filterous(img, format);
	f.filterImage('saturation', 5);
	f.render();
};

exports.invert = function(img, format){
	var f = new Filterous(img, format);
	f.filterImage('invert');
	f.render();
};

exports.blue = function(img, format){
	var f = new Filterous(img, format);
	f.filterImage('blue');
	f.render();
};

exports.green = function(img, format){
	var f = new Filterous(img, format);
	f.filterImage('green');
	f.render();
};

exports.red = function(img, format){
	var f = new Filterous(img, format);
	f.filterImage('red');
	f.render();
};

exports.bright = function(img, format){
 	var f = new Filterous(img, format);
	f.filterImage('brightness', 20);
	f.render();
};

exports.lines = function(img, format){
 	var f = new Filterous(img, format);
	f.filterImage('lines');
	f.render();
};

exports.blackwhite = function(img, format) {
    var f = new Filterous(img, format);
    f.filterImage('blackwhite', 80);
    f.render();
};

// exports.lol = function(img, format) {
//     var f = new Filterous(img, format);
//     var grayscale = f.filterImage('grayscale');
//     var vertical = f.convolute(
//             [ -1, 0, 1,
//             -2, 0, 2,
//             -1, 0, 1 ]);
//     var horizontal = f.convolute(
//             [ -1, -2, -1,
//             0,  0,  0,
//             1,  2,  1 ]);
//     f.filterImage('lol');
//     f.render();
// };

exports.laplace = function(img, format) {
    var f = new Filterous(img, format);
    f.filterImage('convolute',
        [  1, 1,  1,
        1,  0.7, -1,
         -1, -1,  -1]
    );
    f.render();
}





