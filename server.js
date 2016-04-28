
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var http = require('http');

app.set('port', process.env.PORT || 3000);

app.get('/api/food/:item', function(req, res){

    console.log(req.item);
    url = 'http://foodpro.dsa.vt.edu/FoodPro.NET/label.aspx?RecNumAndPort=' + req.params.item;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var recipe, calories, caloriesFromFat, totalFat;
            var totalCarbs, satFat, dietaryFiber, transFat, sugars, cholesterol, protein, sodium;
			var json = { recipe : "", calories: "", caloriesFromFat: "", totalFat: "", totalCarbs: "", satFat: "", dietaryFiber: "", transFat: "", sugars: "", cholesterol: "", protein: "", sodium: ""};

			$('.labelrecipe').filter(function(){
		        var data = $(this);
		        recipe = data.text();
		        
		        json.recipe = recipe;
		        
	        })
            
            $('.labelbody table tr td table tr td font').filter(function(){
		        var data = $(this);
		        var currentWord = data.text(); 
		        console.log(currentWord);
                

                if (currentWord.match("Calories from Fat")) {
                    caloriesFromFat = currentWord;
                    caloriesFromFat = caloriesFromFat.replace(/\u00a0/g, " ");
                    caloriesFromFat = caloriesFromFat.split(" ")[7];
                    json.caloriesFromFat = caloriesFromFat; 
           
                }
                else if (currentWord.match("Calories")) {
                    calories = currentWord;
                    calories = calories.replace(/\u00a0/g, " ");
                    calories = calories.split(" ")[1];
                    json.calories = calories;
                
                }
                else if(currentWord.match("Total Fat")) {
                    totalFat = data.next().text(); 
                    json.totalFat = totalFat;                 
                }
                else if(currentWord.match("Tot. Carb.")) {
                    totalCarbs = data.next().text(); 
                    json.totalCarbs = totalCarbs; 
                }
                else if(currentWord.match("Sat. Fat")) {
                    satFat = data.next().text(); 
                    json.satFat = satFat; 
                }
                else if(currentWord.match("Dietary Fiber")) {
                   dietaryFiber = data.next().text(); 
                   json.dietaryFiber = dietaryFiber;
                }
                else if(currentWord.match("Trans Fat")) { 
                    transFat = data.next().text(); 
                    json.transFat = transFat; 
                }
                else if(currentWord.match("Sugars")) {
                    sugars = data.next().text(); 
                    json.sugars = sugars; 
                }
                else if(currentWord.match("Cholesterol")) {
                    cholesterol = data.next().text(); 
                    json.cholesterol = cholesterol; 
                }
                else if(currentWord.match("Protein")) { 
                    protein = data.next().text(); 
                    json.protein = protein; 
                }
                else if(currentWord.match("Sodium")) {
                    sodium = data.next().text(); 
                    json.sodium = sodium;
                }
	        })
	      
		}

        res.send(json);
        
	})
})



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app; 
