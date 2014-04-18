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


});

require.register("gtsnaker~filterous@master/src/filterousEffects.js", function (exports, module) {
/*
 *  Predefined filter effects with names for Filterous.js
 *
 *  Last modified: March 1, 2014
 */

// Prepare image-layer effects

var rockstarLayer = new Image();
rockstarLayer.src = './effects/bokeh-stars.png';


// Define named effects
 
var ApplyEffects = {
	reset: function(img, format) {
		var f = new Filterous(img, format);
		f.reset();
	},
	fluorescent: function(img, format) {
		// Warm, saturated tones with an emphasis on yellow
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1, 1.2, 1.4]);
		f.filterImage('brightness', 10);
		f.render();
	},
	nostalgia: function(img, format) {
		// Slightly blurred, with sepia tone
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.4, 1.2, 1]);
		f.filterImage('convolute', 
			[ 0.1, 0.1, 0.1,
			  0.1, 0.1, 0.1,
			  0.1, 0.1, 0.1 ]
	    );
	    f.render();
	},
	phykos: function(img, format) {
		// Slightly blurred, with yellow and green saturated
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1, 1.1, 1.1]);
		f.filterImage('convolute', 
			[ 0.1, 0.1, 0.1,
			  0.1, 0.1, 0.1,
			  0.1, 0.1, 0.1 ]
	    );
	    f.render();
	},
	lotus: function(img, format) {
		// Sepia-like, with an emphasis on purples and browns
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.4, 1.15, 1.1]);
		f.render();
	},
	memphis: function(img, format) {
		// Sharp images with a magenta-meets-purple tint
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.2, 1, 1.1]);
		f.filterImage('convolute', 
			[ 0, -1,  0,
	    	 -1,  5, -1,
	    	  0, -1,  0 ]
	    );
	    f.render();
	},
	deutlich: function(img, format) {
		// High exposure
		var f = new Filterous(img, format);
		f.filterImage('convolute', 
			[ 0, 0, 0,
	    	  0, 1.3, 0,
	    	  0, 0, 0 ]
	    );
	    f.render();
	},
	sumie: function(img, format) {
		var f = new Filterous(img, format);
		f.filterImage('grayscale');
		f.render();
	},
	rockstar: function(img, format) {
		// applying a starry layer
		var f = new Filterous(img, format);
		f.applyLayer(rockstarLayer);
		f.render();
	}

};
});

require.register("Filterous", function (exports, module) {
Filterous = require("gtsnaker~filterous@master").Filterous;
ApplyEffects = require("gtsnaker~filterous@master").effects;

(function() {
		var originalPhoto = document.getElementById('originalPhoto');
		
		document.getElementById('filterButtons').addEventListener('click', prepFilterEffect, false);
		
		function prepFilterEffect(e){
			var filterButton = getFilterButton(e.target);
			if(!filterButton) return;
			
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
