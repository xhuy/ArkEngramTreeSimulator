var arkSkillTreeModule = (function() {
	// private
	var cookingItems;
	var toolsItems;
	return {
		// public
		init : function() {

			$.ajax({
				dataType : "json",
				url : 'data/cooking.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				cookingItems = data;
				arkSkillTreeModule.drawImages(cookingItems);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus);
			});

			$.ajax({
				dataType : "json",
				url : 'data/tools.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				toolsItems = data;
				arkSkillTreeModule.drawImages(toolsItems);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus);
			});

		},

		drawImages : function(data) {
			var canvas = new fabric.Canvas('canvasArkEngramTree');

			$.each(data, function(index, value) {
				fabric.Image.fromURL(value.image, function(image) {
					canvas.add(image);
				});
			});
		},

		getCookingItems : function() {
			return cookingItems;
		}
	};
})();

$(document).ready(function() {

	arkSkillTreeModule.init();

});