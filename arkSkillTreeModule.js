var arkSkillTreeModule = (function() {
	// private
	var cookingItems;
	var toolsItems;
	var armorItems;
	var structureItems;
	var weaponsItems;
	var canvas;
	var offsetLines = 25;
	return {
		// public
		init : function() {

			arkSkillTreeModule.canvas = new fabric.Canvas(
					'canvasArkEngramTree', {
						selection : false
					});

			$.ajax({
				dataType : "json",
				url : 'data/armor.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				armorItems = data;
				arkSkillTreeModule.drawImages(armorItems);
				// arkSkillTreeModule.drawLines(armorItems);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in armor.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/cooking.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				cookingItems = data;
				arkSkillTreeModule.drawImages(cookingItems);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in cooking.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/structures.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				structureItems = data;
				arkSkillTreeModule.drawImages(structureItems);
				arkSkillTreeModule.drawLines(structureItems);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in structures.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/tools.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				toolsItems = data;
				arkSkillTreeModule.drawImages(toolsItems);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in tools.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/weapons.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				weaponsItems = data;
				arkSkillTreeModule.drawImages(weaponsItems);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in weapons.json");
			});

			// var canvas = new fabric.Canvas('canvasArkEngramTree');
			// fabric.loadSVGFromURL('http://localhost:8080/Ark/docs/engram_tree.svg',
			// function(objects, options) {
			// var obj = fabric.util.groupSVGElements(objects, options);
			// canvas.add(obj).renderAll();
			// });

			arkSkillTreeModule.canvas.on('object:moving', function(e) {
				var image = e.target;
				console
						.log("Element ID: " + image.id + ", Type: "
								+ image.type);

				var objectMoving = arkSkillTreeModule.findByIdOrName(
						image.type, image.id);

				$.each(objectMoving.unlocksLines, function(index, value) {
					value.set({
						'x1' : image.left + offsetLines,
						'y1' : image.top + offsetLines
					})

				});
				arkSkillTreeModule.canvas.renderAll();
			});

		},

		drawImages : function(data) {

			$.each(data, function(index, value) {
				fabric.Image.fromURL(value.imageURL, function(image) {
					value.image = image;
					if (value.id !== null) {
						image.id = value.id;
						image.type = value.type;
					} else {
						image.id = value.name;
						image.type = value.type;
					}
					image.left = value.imageX;
					image.top = value.imageY;
					image.hasControls = image.hasBorders = false;
					arkSkillTreeModule.canvas.add(image);
				});
			});
		},

		drawLines : function(jsonData) {
			$.each(jsonData, function(index, father) {
				$.each(father.unlocks, function(index, sonArray) {
					var son = arkSkillTreeModule.findByIdOrName(sonArray[0],
							sonArray[1]);

					if (son !== undefined) {
						var coords = [];
						coords.push(father.imageX + offsetLines);
						coords.push(father.imageY + offsetLines);
						coords.push(son.imageX + offsetLines);
						coords.push(son.imageY + offsetLines);

						var line = new fabric.Line(coords, {
							fill : 'red',
							stroke : 'red',
							strokeWidth : 5,
							selectable : false
						});

						father.unlocksLines.push(line);

						arkSkillTreeModule.canvas.add(line);
					}
				});
			});
		},

		findByIdOrName : function(typeItem, idOrName) {

			if (typeItem === "structures") {
				var indexFinded = -1;
				$.each(structureItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				return structureItems[indexFinded];
			}
		},

		getCookingItems : function() {
			return cookingItems;
		}
	};
})();

$(document).ready(function() {

	arkSkillTreeModule.init();

});