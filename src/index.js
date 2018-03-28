/*
    use newsapi.org to retreive news data, save data to csv
    https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6afbb998f94c435180c8d4ce4282b7cf
*/
var request = require("request-promise")

var Source = function(api_key, defaults){
    // define api_key
    if(typeof api_key == "undefined") throw new Error("api_key must be defined");
    this.api_key = api_key;

    // define query_defaults
    if(typeof defaults == "undefined") defaults = {}; // default to empty object - no defaults
    if(typeof defaults != "object") throw new Error("defaults must be an object"); // if here, then user did not define defaults properly
    this.query_defaults = defaults;
}
Source.prototype = {
    // request method
    retreive : function(request){
        var query_params = this.normalize_request(request);
    },

    // helper methods
    normalize_request : function(request){
        // cast to empty object if undefined
        if(typeof request == "undefined") request = {};

        // initialize datastructure
        var query_params = {};
        Object.assign(query_params, this.query_defaults); // append defaults to query params

        // append require parameters
        query_params.apiKey = this.api_key;

        // append optional paramters
        if(typeof request.country != "undefined") query_params.country = request.country; // enable setting country
        if(typeof request.catagory != "undefined") query_params.catagory = request.catagory; // enable setting catagory

        // return query_params
        return query_params;
    },
    make_request : function(query_params){
        var api_root =  "https://newsapi.org/v2/";
    },
    parse_response : function(){

    },
}
module.exports = Source;
/*
var path = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6afbb998f94c435180c8d4ce4282b7cf";
request(path)
    .then((response)=>{
        console.log("resopnse:");
        console.log(JSON.parse(response));
    })
*/
