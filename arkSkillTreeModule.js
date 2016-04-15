var arkSkillTreeModule = (function() {
	// private

	// JSON Data
	var armorItems;
	var cookingItems;
	var craftingItems;
	var resourceItems;
	var saddleItems;
	var structureItems;
	var toolsItems;
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

			// Getting informaton from JSON
			$.ajax({
				dataType : "json",
				url : 'data/armor.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				armorItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in armor.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/cooking.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				cookingItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in cooking.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/crafting.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				craftingItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in crafting.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/resource.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				resourceItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in resource.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/saddle.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				saddleItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in saddle.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/structures.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				structureItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in structures.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/tools.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				toolsItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in tools.json");
			});

			$.ajax({
				dataType : "json",
				url : 'data/weapons.json',
				async : true
			}).done(function(data, textStatus, jqXHR) {
				weaponsItems = data;
				arkSkillTreeModule.checkData();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(textStatus + " in weapons.json");
			});

			// When there is an event in the canvas
			arkSkillTreeModule.canvas.on('object:moving', function(e) {
				var image = e.target;
				console.log("Element ID: " + image.id + ", Type: " + image.type
						+ "X:" + image.left + ",Y:" + image.top);

				var objectMoving = arkSkillTreeModule.findByIdOrName(
						image.type, image.id);

				$.each(objectMoving.unlocksLines, function(index, value) {
					value[1].set({
						'x1' : image.left + offsetLines,
						'y1' : image.top + offsetLines
					})

				});

				$.each(objectMoving.prerequisites, function(index, value) {

					var beforeNode = arkSkillTreeModule.findByIdOrName(
							value[0], value[1]);

					if (beforeNode !== undefined) {

						$.each(beforeNode.unlocksLines, function(index, value) {
							var startNodeId = value[0].split("->")[0];
							var endNodeId = value[0].split("->")[1];

							if (endNodeId === objectMoving.id.toString())

								value[1].set({
									'x2' : image.left + offsetLines,
									'y2' : image.top + offsetLines
								})

						});
					}

				});

				arkSkillTreeModule.canvas.renderAll();
			});

			arkSkillTreeModule.canvas.observe('mouse:over', function(e) {
				// console.log("Everyday I'm hovering");
				// arkSkillTreeModule.showImageTools(e.target);
			});
			arkSkillTreeModule.canvas.observe('mouse:out', function(e) {
				$('#imageDialog').remove();
			});

		},

		// Drawing images to the canvas from an array which are the json objects
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

		// Drawing lines that represent the prerequisites and unlocks of each
		// item
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

						father.unlocksLines.push([ father.id + "->" + son.id,
								line ]);

						arkSkillTreeModule.canvas.add(line);
					}
				});
			});
		},

		// Auxiliar function that finds an object in all the arrays representing
		// the items, recieves the type of item and id or name of the item to be
		// searched, returns undefined when there is no match
		findByIdOrName : function(typeItem, idOrName) {

			if (typeItem === "armor") {
				var indexFinded = -1;
				$.each(armorItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return armorItems[indexFinded];
			} else if (typeItem === "cooking") {
				var indexFinded = -1;
				$.each(cookingItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return cookingItems[indexFinded];
			} else if (typeItem === "crafting") {
				var indexFinded = -1;
				$.each(craftingItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return craftingItems[indexFinded];
			} else if (typeItem === "resource") {
				var indexFinded = -1;
				$.each(resourceItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return resourceItems[indexFinded];
			} else if (typeItem === "saddle") {
				var indexFinded = -1;
				$.each(saddleItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return saddleItems[indexFinded];
			} else if (typeItem === "structures") {
				var indexFinded = -1;
				$.each(structureItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return structureItems[indexFinded];
			} else if (typeItem === "tools") {
				var indexFinded = -1;
				$.each(toolsItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return toolsItems[indexFinded];
			} else if (typeItem === "weapons") {
				var indexFinded = -1;
				$.each(weaponsItems, function(index, item) {
					if (item.id === idOrName || item.name === idOrName) {
						indexFinded = index;
					}
				});
				if (indexFinded === -1)
					return undefined;
				else
					return weaponsItems[indexFinded];
			}
		},

		showImageTools : function(e) {
			if (!$('#imageDialog').length) {
				$('body')
						.append(
								"<div id='imageDialog' style='position: absolute; top: 0; left: 0'><h1>Hello</h1></div>");
			}

			arkSkillTreeModule.moveImageTools(e);

		},

		moveImageTools : function(e) {

			var w = $('#imageDialog').width();
			var h = $('#imageDialog').height();
			// var e = canvas.getActiveObject();
			// var e = canvas._setCursorFromEvent();
			var coords = arkSkillTreeModule.getObjPosition(e);
			// console.log('coords', coords);
			// -1 because we want to be inside the selection body
			var top = coords.bottom - h - 1;
			var left = coords.right - w - 1;
			$('#imageDialog').show();
			$('#imageDialog').css({
				top : top,
				left : left
			});
		},

		getObjPosition : function(e) {
			// Get dimensions of object
			var rect = e.getBoundingRect();
			// We have the bounding box for rect... Now to get the canvas
			// position
			var offset = arkSkillTreeModule.canvas.calcOffset();
			// Do the math - offset is from $(body)
			var bottom = offset._offset.top + rect.top + rect.height;
			var right = offset._offset.left + rect.left + rect.width;
			var left = offset._offset.left + rect.left;
			var top = offset._offset.top + rect.top;
			return {
				left : left,
				top : top,
				right : right,
				bottom : bottom
			};
		},

		checkData : function() {
			if (armorItems !== undefined
					&& cookingItems !== undefined
					&& craftingItems !== undefined
					&& resourceItems !== undefined
					&& saddleItems !== undefined
					&& structureItems !== undefined
					&& toolsItems !== undefined
					&& weaponsItems !== undefined) {
				arkSkillTreeModule.drawImages(armorItems);
				arkSkillTreeModule.drawImages(craftingItems);
				arkSkillTreeModule.drawImages(cookingItems);
				arkSkillTreeModule.drawImages(resourceItems);
				arkSkillTreeModule.drawImages(structureItems);
				arkSkillTreeModule.drawImages(toolsItems);
				arkSkillTreeModule.drawImages(weaponsItems);
				arkSkillTreeModule.drawImages(saddleItems);

				arkSkillTreeModule.drawLines(armorItems);
				arkSkillTreeModule.drawLines(craftingItems);
				arkSkillTreeModule.drawLines(cookingItems);
				arkSkillTreeModule.drawLines(resourceItems);
				arkSkillTreeModule.drawLines(structureItems);
				arkSkillTreeModule.drawLines(toolsItems);
				arkSkillTreeModule.drawLines(weaponsItems);
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