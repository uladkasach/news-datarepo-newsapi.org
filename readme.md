# news-datarepo-newsapi.org

This module is a source 'plugin' for the [news-datarepo-core](https://github.com/uladkasach/news-datarepo-core) module.

This module is capable of retrieving results from the [newsapi.org](https://newsapi.org) api. The [news-datarepo-core](https://github.com/uladkasach/news-datarepo-core) module is then utilized to persistently cache the data for retrieval in the future on your own computer.

### options
- country : us, uk, etc
- catagory : business
- endpoint : top-headlines, everything, sources
- from / to : YYYY-MM-DD
- sort_by : "top", "latest", "popular", "relevancy"
- language : "en"
