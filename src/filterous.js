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
		for (var i = 0, len = d.length; i < len; i += 4) {
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
		for (var i = 0, len = d.length; i < len; i += 4) {
			d[i] += adjustment;
			d[i + 1] += adjustment;
			d[i + 2] += adjustment;
		}
		return pixels;
	},

	rgbAdjust: function(pixels, rgb) {
		var d = pixels.data;
		for (var i = 0, len = d.length; i < len; i +=4) {
			d[i] *= rgb[0];		//R
			d[i + 1] *= rgb[1];	//G
			d[i + 2] *= rgb[2];	//B
		}
		return pixels;
	},

	sepia: function(pixels) {
		var d = pixels.data;
		for (var i = 0, len = d.length; i < len; i += 4) {
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
		for (var i = 0, len = d.length; i < len; i += 4) {
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
		for (var i = 0, len = d.length; i < len; i += 4) {
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
		for (var i = 0, len = d.length; i < len; i += 4) {
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
		for (var i = 0, len = d.length; i < len; i += 4) {
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
		for (var i = 0, len = d.length; i < len; i += 4) {
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
		for (var i = 0, len = d.length; i < len; i += 167) {
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
        for (var i=0, len = d.length; i<d.leni+=4) {
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
exports.effects = require('./filterousEffects')

