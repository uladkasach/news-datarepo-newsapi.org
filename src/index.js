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
    retreive : async function(request){
        var query_params = this.normalize_request(request);
        var response = await this.make_request(query_params);
        var articles = this.parse_response(response);
        return articles;
    },

    // helper methods
    request_keys : { // a request_key mapping - we expect "query", but api expects "q"
        "to" : "to",
        "from" : "from",
        "query" : "q",
        "sort_by" : "sortBy",
        "endpoint" : "endpoint", // special internally used only param
        "country" : "country",
        "catagory" : "catagory",
        "api_key" : "apiKey",
    },
    normalize_request : function(this_request){
        // cast to empty object if undefined
        if(typeof request == "undefined") request = {};

        // TODO - make mapping our {} paramters to their {} parameters (the names, e.g., sort_by -> sortBy) more explicit and occur only once
        // we should not be concerned with their mappings untill we are done parsing the users data, which is not how this opperates yet

        // combine defaults and request object
        var request = {};
        Object.assign(request, this.query_defaults); // append defaults to request
        Object.assign(request, this_request); // append users request to request

        // build query_params from options
        var query_params = {};
        var valid_keys = Object.keys(this.request_keys);
        valid_keys.forEach((key)=>{
            if(typeof request[key] != "undefined") query_params[key] = request[key]; // append the key if its defined
        })

        // append api_key to params
        query_params.api_key = this.api_key;

        // ensure required parameters are defined
        if(typeof query_params.endpoint != "string") throw new Error("endpoint must be defined");
        if(typeof query_params.api_key != "string") throw new Error("api_key must be defined");

        // ensure defined parameters are valid
        if(typeof query_params.endpoint != "undefined"){
            if(!["top-headlines", "everything", "sources"].includes(query_params.endpoint)) throw new Error("endpoint must be valid: everything, top-headlines, or sources");
        }
        if(typeof query_params.sort_by != "undefined"){
            if(!["top", "latest", "popular"].includes(query_params.sort_by)) throw new Error("sort_by is not valid")
        }
        var date_regex = /(\d{4}-\d{2}-\d{2})/g; // assert YYYY-MM-DD
        if(typeof query_params.from != "undefined"){
            if(!date_regex.test(query_params.from)) throw new Error("from date not valid");
        }
        if(typeof query_params.to != "undefined"){
            if(!date_regex.test(query_params.to)) throw new Error("to date not valid");
        }

        // map the parameters to what api expects
        var mapped_query_params = {};
        var present_keys = Object.keys(query_params);
        present_keys.forEach((key)=>{
            var mapped_key = this.request_keys[key];
            mapped_query_params[mapped_key] = query_params[key];
        })

        // return mapped_query_params
        return mapped_query_params;
    },
    make_request : async function(query_params){
        var api_root =  "https://newsapi.org/v2/";
        var path = api_root + query_params.endpoint;
        var response = await request({ uri: path, qs : query_params});
        response = JSON.parse(response);
        return response;
    },
    parse_response : function(response){
        /*
            for each article, return
            {
                timestamp : __,
                title : __,
                description: __,
                url : __,
            }
        */

        // normalize the data responded with
        var data = [];
        response.articles.forEach((article)=>{
            let this_data = {
                timestamp : article.publishedAt,
                title : article.title,
                description : article.description,
                url : article.url,
            }
            data.push(this_data);
        })

        // return the data
        return data;
    },
}
module.exports = Source;
