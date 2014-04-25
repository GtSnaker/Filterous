/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("gtsnaker~filterous@master", function (exports, module) {
/*
 *  Filterous.js - Simple Photo Filters using Canvas
 *  https://github.com/girliemac/Filterous/
 *  Tomomi Imura (@girlie_mac) - http://girliemac.com
 *  License under MIT
 *  Updated on: March 2, 2014
 */

var Filterous = function(imgObj, output) {
	this.imgObj = imgObj;
	this.output = output;

	// Remove the revious
	var prevFilteredPhoto = document.getElementById('filteredPhoto');
	if(prevFilteredPhoto) {
		prevFilteredPhoto.parentNode.removeChild(prevFilteredPhoto);
	}

	this.c = document.createElement('canvas');
	this.c.id = 'filteredPhoto';
	this.c.width = imgObj.naturalWidth;
	this.c.height = imgObj.naturalHeight;
	this.ctx = this.c.getContext('2d');
	this.ctx.drawImage(imgObj, 0, 0);
}

Filterous.prototype = {
	applyLayer: function(layerObj) {
		this.ctx.drawImage(layerObj, 0, 0, this.c.width, this.c.height);
	},

	filterImage: function(filter, args) {
		if(this.pixelData) { // if multiple filters are applied
			this.ctx.putImageData(this.pixelData, 0, 0);
		}
		var params = [this.ctx.getImageData(0, 0, this.c.width, this.c.height)];

		for (var i = 1; i <arguments.length; i++) {
			params.push(arguments[i]);
		}
		this.pixelData =  this[filter].apply(this, params);
	},

	render: function(reset) {
		if(reset) {
			this.ctx.drawImage(this.imgObj, 0, 0);
		} else if(this.pixelData) {
			this.ctx.putImageData(this.pixelData, 0, 0);
		}

		if(this.output) {
			var newImgObj = this.createNewImgObj(this.output);
			this.imgObj.parentNode.insertBefore(newImgObj, this.imgObj);
		} else {
			this.imgObj.parentNode.insertBefore(this.c, this.imgObj);
		}

		this.imgObj.setAttribute('hidden', 'hidden');
	},

	createNewImgObj: function(format) {
		// Format has to be 'png', 'jpeg' or 'wepb', otherwise fall bacl to 'png'
		var img = document.createElement('img');
		img.id = 'filteredPhoto';
		img.src = this.c.toDataURL('image/'+format);
		return img;
	},

	reset: function() {
		this.render('reset');
	},

	grayscale: function(pixels, args) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i + 1];
			var b = d[i + 2];
			// CIE 1931 luminance
			var avg = 0.2126*r + 0.7152*g + 0.0722*b;
			// d is a reference to pixels.data, so you do not need to reassign it
			d[i] = d[i + 1] = d[i + 2] = avg
		}
		return pixels;
	},

	brightness: function(pixels, adjustment) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			d[i] += adjustment;
			d[i + 1] += adjustment;
			d[i + 2] += adjustment;
		}
		return pixels;
	},

	rgbAdjust: function(pixels, rgb) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i +=4) {
			d[i] *= rgb[0];		//R
			d[i + 1] *= rgb[1];	//G
			d[i + 2] *= rgb[2];	//B
		}
		return pixels;
	},

	sepia: function(pixels) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i+1]
			var b = d[i+2]
			d[i] = Math.min((r * .393) + (g *.769) + (b * .189), 255);
			d[i + 1] = Math.min((r * .349) + (g *.686) + (b * .168), 255);
			d[i + 2] = Math.min((r * .272) + (g *.534) + (b * .131), 255);
		}
		return pixels;
	},

	saturation: function(pixels, value) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i+1]
			var b = d[i+2]
			var p = Math.sqrt((r*r*.299)+(g*g*.587)+(b*b*.114))
			d[i] = p+((r - p)*value);
			d[i + 1] = p+((g - p)*value);
			d[i + 2] = p+((b - p)*value);
		}
		return pixels;
	},

	invert: function(pixels) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i+1]
			var b = d[i+2]
			
			d[i] = 255 -r;
			d[i + 1] = 255 -g;
			d[i + 2] = 255 -b;
		}
		return pixels;
	},

	blue: function(pixels) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i+1]
			var b = d[i+2]
			
			d[i] = r;
			d[i + 1] = g;
			d[i + 2] = b+50;
		}
		return pixels;
	},

	red: function(pixels) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i+1]
			var b = d[i+2]
			
			d[i] = r+ 50;
			d[i + 1] = g;
			d[i + 2] = b;
		}
		return pixels;
	},

	green: function(pixels) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i+1]
			var b = d[i+2]
			
			d[i] = r;
			d[i + 1] = g+50;
			d[i + 2] = b;
		}
		return pixels;
	},

	lines: function(pixels) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 167) {
			d[i] += 80;
			d[i + 1] += 80;
			d[i + 2] += 80;
			d[i + 3] += 80;
			d[i + 4] += 80;
			d[i + 5] += 80;
			d[i + 6] -= 80;
			d[i + 7] -= 80;
			d[i + 8] -= 80;
			d[i + 9] -= 80;
			d[i + 10] -= 80;
			d[i + 11] -= 80;
		}
		return pixels;
	},

	blackwhite: function(pixels, threshold) {
        var d = pixels.data;
        for (var i=0; i<d.length; i+=4) {
            var r = d[i];
            var g = d[i+1];
            var b = d[i+2];
            var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
            d[i] = d[i+1] = d[i+2] = v
        }
        return pixels;
    },

	// lol: function(pixels) {
    //     var final_image = f.createImageData(vertical.width, vertical.height);
    //     for (var i=0; i<final_image.data.length; i+=4) {
    //         // make the vertical gradient red
    //         var v = Math.abs(vertical.data[i]);
    //         final_image.data[i] = v;
    //         // make the horizontal gradient green
    //         var h = Math.abs(horizontal.data[i]);
    //         final_image.data[i+1] = h;
    //         // and mix in some blue for aesthetics
    //         final_image.data[i+2] = (v+h)/4;
    //         final_image.data[i+3] = 255; // opaque alpha
    //     }
    // },

	createImageData: function(w, h) {
		var tmpCanvas = document.createElement('canvas'),
			tmpCtx = tmpCanvas.getContext('2d');
		return tmpCtx.createImageData(w, h);
	},

	convolute: function(pixels, weights, opaque) {
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = (side/2) >>> 0;

		var src = pixels.data;
		var sw = pixels.width;
		var sh = pixels.height;

		var w = sw;
		var h = sh;
		var output = Filterous.prototype.createImageData(w, h);
		var dst = output.data;

		var alphaFactor = opaque ? 1 : 0;

		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var sy = y;
				var sx = x;
				var dstOff = (y * w + x)*4;
				var r = 0, g = 0, b = 0, a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
						var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
						var srcOff = (scy * sw + scx) * 4;
						var wt = weights[cy * side + cx];
						r += src[srcOff] * wt;
						g += src[srcOff + 1] * wt;
						b += src[srcOff + 2] * wt;
						a += src[srcOff + 3] * wt;
					}
				 }
			 dst[dstOff] = r;
			 dst[dstOff + 1] = g;
			 dst[dstOff + 2] = b;
			 dst[dstOff + 3] = a + alphaFactor * (255 - a);
			 }
		}
		return output;
	}
}

exports.Filterous = Filterous;
exports.effects = require("gtsnaker~filterous@master/src/filterousEffects.js")


});

require.register("gtsnaker~filterous@master/src/filterousEffects.js", function (exports, module) {
/*
 *  Predefined filter effects with names for Filterous.js
 *
 *  Last modified: March 1, 2014
 */

// Prepare image-layer effects
Filterous = require("gtsnaker~filterous@master").Filterous

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






});

require.register("Filterous", function (exports, module) {
filterous = require("gtsnaker~filterous@master");
Filterous = filterous.Filterous;
ApplyEffects = filterous.effects;

(function() {
	var originalPhoto = document.getElementById('originalPhoto');

	document.getElementById('filterButtons').addEventListener('click', prepFilterEffect, false);

	function prepFilterEffect(e){
		var filterButton = getFilterButton(e.target);
		if(!filterButton) return;
		debugger

		ApplyEffects[filterButton.id](originalPhoto, 'jpeg');

	}
	function getFilterButton(target) {
		var button;
		if(target.classList.contains('filter')) {
			button = target;
		} else if (target.parentNode.classList.contains('filter')) {
			button = target.parentNode;
		}
		return button;
	}

	// Additional photo samples --

	var p1 = new Image();
	p1.src = 'aurora.jpg';
	var p2 = new Image();
	p1.src = 'macarons.jpg';

	var photos = {
		aurora: 'Aurora Borealis',
		bride: 'विवाह',
		macarons: 'Colorful Macarons'
	};

	var caption = document.getElementById('caption');

	window.addEventListener('hashchange', function(e){
		var hash = location.hash.substr(1);
		originalPhoto.src = hash + '.jpg';
		caption.textContent = photos[hash];
		var prevFilteredPhoto = document.getElementById('filteredPhoto');
		if(prevFilteredPhoto) {
			prevFilteredPhoto.parentNode.removeChild(prevFilteredPhoto);
			originalPhoto.removeAttribute('hidden');
		}
	}, false);

})();
});

require("Filterous")
