var assert = require("assert");
var request = require("request-promise");
var config = require("../config/test_config.json")
var fs = require('fs');
var example_response = fs.readFileSync(__dirname + "/example_response.txt", 'utf8'); // blocking read

var Source = require("../src/class.js");

describe("init", function(){
    it("should initialize with api_key", function(){
        var source = new Source("test_key");
        assert.equal(typeof source, "object");
        assert.equal(source.api_key, "test_key");
    })
    it("should default `defaults` to empty object", function(){
        var source = new Source("test_key");
        assert.equal(JSON.stringify(source.query_defaults), JSON.stringify({}));
    })
    it("should throw error if no api_key", function(){
        try {
            var source = new Source();
            throw new Error("should not reach here");
        } catch (error){
            assert.equal(error.message, "api_key must be defined")
        }
    })
    it("should initialize with defaults", function(){
        var source = new Source("test_key", {country:"us"});
        assert.equal(source.query_defaults.country, "us");
    })
    it("should throw error if defaults is not an object", function(){
        try {
            var source = new Source("test_api", "not an object");
            throw new Error("should not reach here");
        } catch (error){
            assert.equal(error.message, "defaults must be an object")
        }
    })
})
describe("request normalization", function(){
    it("should complain if endpoint is not defined", function(){
        var source = new Source("test_key");
        try{
            var query_params = source.normalize_request();
            throw new Error("should not reach here")
        } catch (error){
            assert.equal(error.message, "endpoint must be defined");
        }
    })
    it("should set endpoint", function(){
        var source = new Source("test_key");
        var query_params = source.normalize_request({endpoint:"top-headlines"});
        assert.equal(query_params.endpoint, "top-headlines");
    })
    it("should use defaults", function(){
        var source = new Source("test_key", {country:"us", endpoint:"top-headlines"});
        var query_params = source.normalize_request();
        assert.equal(query_params.country, "us");
    })
    it("should append apiKey", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request();
        assert.equal(query_params.apiKey, "test_key")
    }),
    it("should set country", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({country:"ag"});
        assert.equal(query_params.country, "ag");
    })
    it("should set catagory", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({catagory:"business"});
        assert.equal(query_params.catagory, "business");
    })
    it("should set query", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({query:"NYSE:F"});
        assert.equal(query_params.q, "NYSE:F");
    })
    it("should set language", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({language:"en"});
        assert.equal(query_params.language, "en");
    })
    it("should set from", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({from:"2018-03-15"});
        assert.equal(query_params.from, "2018-03-15");
    })
    it("should set to", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({to:"2018-03-16"});
        assert.equal(query_params.to, "2018-03-16");
    })
    it("should set both to and from", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({from:"2018-02-16", to:"2018-03-16"});
        assert.equal(query_params.from, "2018-02-16");
        assert.equal(query_params.to, "2018-03-16");
    })
    it("should complain if not a valid date - from", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        try{
            var query_params = source.normalize_request({from:"2018-03-"});
            throw new Error("should not reach here");
        } catch(error){
            assert.equal(error.message, "from date not valid");
        }
    })
    it("should complain if not a valid date - to", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        try{
            var query_params = source.normalize_request({to:"2018-03-"});
            throw new Error("should not reach here");
        } catch(error){
            assert.equal(error.message, "to date not valid");
        }
    })
    it("should set sort_by", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        var query_params = source.normalize_request({sort_by:"latest"});
        assert.equal(query_params.sortBy, "latest");
    })
    it("should complain if sort_by is not valid", function(){
        var source = new Source("test_key", {endpoint:"top-headlines"});
        try{
            var query_params = source.normalize_request({sort_by:"latests"});
            throw new Error("should not reach here");
        } catch(error){
            assert.equal(error.message, "sort_by is not valid")
        }
    })
    it("should set page")
    it("should overwrite defaults", function(){
        var source = new Source("test_key", {endpoint:"top-headlines",country:"us"});
        var query_params = source.normalize_request({country:"uk"});
        assert.equal(query_params.country, "uk");
    })
})
describe("making request", async function(){
    it("should find that manual request can be made", async function(){
        this.skip();
        var path = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6afbb998f94c435180c8d4ce4282b7cf";
        var response = await request(path)
        assert.equal(typeof response, "string");
        //console.log("response:");
        //console.log(JSON.parse(response));
    })
    it("should find that manual request with qs can be made", async function(){
        this.skip();
        var path = "https://newsapi.org/v2/top-headlines";
        var query_params = {
            country : "us",
            catagory : "business",
            apiKey : config.api_key,
        }
        var response = await request({uri : path, qs : query_params})
        assert.equal(typeof response, "string");
    })
    it("should be able to make a request", async function(){
        this.skip();
        var source = new Source(config.api_key, {country:"us"});
        var query_params = source.normalize_request({endpoint:"top-headlines", catagory:"business"});
        var response = await source.make_request(query_params);
        assert.equal(typeof response, "object"); // repsonse should be an object
    })
    it("should be able to retreive all pages");
})
describe("parsing response", function(){
    it("should be able to parse response", function(){
        var response = JSON.parse(example_response);
        var articles = response.articles;
        var articles = Source.prototype.parse_articles(articles);
        articles.forEach((article)=>{
            assert(typeof article.timestamp, "string");
            assert(typeof article.title, "string");
            assert(typeof article.url, "string");
        })
    })
})
describe("all together", async function(){
    it("should be able to retreive data as expected", async function(){
        this.skip();
        var source = new Source(config.api_key, {country:"us"});
        var articles = await source.retreive({
            endpoint : "top-headlines",
            catagory : "business",
        })
        assert.equal(Array.isArray(articles), true); // articles should be an array;
    })
})
