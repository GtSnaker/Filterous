filterous = require('GtSnaker-Filterous');
Filterous = filterous.Filterous;
ApplyEffects = filterous.effects;

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