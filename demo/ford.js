var config = require("../config/test_config.json");
var Source = require("../src/index.js");
var source = new Source(config.api_key, {endpoint:"everything", catagory:"business", language:"en"})

var test = async function(){
    var articles = await source.retreive({query:"nyse ford", page:"all", from:"2018-01-01", to:"2018-01-15"});
    console.log(articles.length)
}
test();