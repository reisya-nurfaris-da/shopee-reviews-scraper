# Shopee Reviews Scraper

> Only tested on Shopee Indonesia

Just run it in your browser that's already logged into Shopee.

These params are from the logged get_ratings request. Not really sure on what each param does, but what I know is `filter:1` is to only return ratings that has comments
```
exclude_filter: 1,
fe_toggle:      JSON.stringify([2,3]),
filter:         1,
filter_size:    0,
flag:           1,
fold_filter:    0,
itemid:         itemid,
shopid:         shopid,
limit:          limit,
offset:         offset,
preferred_item_include_type: 1,
preferred_item_item_id:      itemid,
preferred_item_shop_id:      shopid,
relevant_reviews: false,
request_source:   2,
tag_filter:       '',
type:             0,
variation_filters:''
```
