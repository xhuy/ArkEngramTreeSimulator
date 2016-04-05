var arkSkillTreeModule = (function() {
    // private 
    var cookingItems;
    var cookingImages;
    return {
        // public
        init: function() {
            
            $.getJSON('data/cooking.json', function(data) {
                alert(data);
                cookingItems = data;
            });
            
            cookingImages = [];
            for (var i = 0; i < cookingItems.length; i++) {
                var image = new Image();
                image.src = cookingItems[i].image;
                cookingImages.push(image);
            }
        },
        
        getCookingImages: function() {
            return cookingImages;
        }
    };
})();

$(document).ready(function() {
    arkSkillTreeModule.init();
    
    var c = document.getElementById("canvasArkEngramTree");
    var ctx = c.getContext("2d");
    
    var images = arkSkillTreeModule.getCookingImages();
    
    for (var i = 0; i < images.length; i++) {
        ctx.drawImage(images[i], 10, 10, 256, 256);
    }
});
