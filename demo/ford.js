var config = require("../config/test_config.json");
var Source = require("../src/index.js");
var source = new Source(config.api_key, {endpoint:"everything", catagory:"business", from:"2018-03-01", language:"en"})

var test = async function(){
    var articles = await source.retreive({query:"nyse ford"});
    console.log(articles);
    console.log(articles.length)
}
test();
