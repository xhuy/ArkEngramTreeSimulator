var arkSkillTreeModule = (function() {
	// private
	var cookingItems;
	var cookingImages;
	return {
		// public
		init : function() {

			$.getJSON('data/cooking.json', function(data) {
				cookingItems = data;
				cookingImages = [];
				for (var i = 0; i < cookingItems.length; i++) {
					var image = new Image();
					image.src = cookingItems[i].image;
					cookingImages.push(image);
				}
				var canvas = new fabric.Canvas('canvasArkEngramTree');

				var images = arkSkillTreeModule.getCookingImages();

				for (var i = 0; i < images.length; i++) {
					var imgInstance = new fabric.Image(images[i], {
						left : 10,
						top : 20,
						angle : 0,
						opacity : 0.85
					});
					canvas.add(imgInstance);
				}
			});
		},

		getCookingImages : function() {
			return cookingImages;
		}
	};
})();

$(document).ready(function() {
	arkSkillTreeModule.init();
	
	var canvas = new fabric.Canvas('canvasArkEngramTree');
	fabric.Image.fromURL('images/00001-Campfire.png', function(oImg) {
		  canvas.add(oImg);
		});
});
