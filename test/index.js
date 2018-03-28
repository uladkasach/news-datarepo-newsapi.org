var assert = require("assert");

var Source = require("../src/index.js");

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
describe("normalization", function(){
    it("should append apiKey", function(){
        var source = new Source("test_key");
        var query_params = source.normalize_request();
        assert.equal(query_params.apiKey, "test_key")
    }),
    it("should use defaults", function(){
        var source = new Source("test_key", {country:"us"});
        var query_params = source.normalize_request();
        assert.equal(query_params.country, "us");
    })
    it("should set country", function(){
        var source = new Source("test_key");
        var query_params = source.normalize_request({country:"ag"});
        assert.equal(query_params.country, "ag");
    })
    it("should set catagory", function(){
        var source = new Source("test_key");
        var query_params = source.normalize_request({catagory:"business"});
        assert.equal(query_params.catagory, "business");
    })
    it("should overwrite defaults", function(){
        var source = new Source("test_key", {country:"uk"});
        var query_params = source.normalize_request();
        assert.equal(query_params.country, "uk");
    })
})
describe("making request", function(){
    it("should be able to make a request", async function(){

    })
})
