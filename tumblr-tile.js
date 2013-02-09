(function() {

    var configStr = localStorage['tumblr-tile'];
    var configJson = configStr ? JSON.parse(configStr) : {};

    if ( ! configJson.apiKey ) {
        console.log("not exists api key");
        return 1;
    }

    var url = configJson.hostname || "aoi-miyazaki.tumblr.com";
    var api_key = configJson.apiKey
    var baseWidth = configJson.baseWidth || 250;
    var column = configJson.column || 5;

    var limit = 20;
    var offset = 0;
    var isAccessTumblr = false;

    getTumblrPhotos(function(div) {
        $("#container").append($(div));
    }).then(function() {
        $("#container").masonry({
            itemSelector: ".item",
            columnWidth: function( containerWidth ) {
                return containerWidth / column;
            },
        });
    }).then(function() {
        $(window).scroll(function() {
            if ( isAccessTumblr == false && $(window).scrollTop() + $(window).height() >= $(document).height() ) {

                isAccessTumblr = true;
                var divs = "";

                getTumblrPhotos(function(div) {
                    divs += div;
                }).then(function() {
                    console.log(divs);
                    var $divs = $(divs);
                    $("#container").append($divs).masonry( 'appended', $divs, false );
                }).then(function() {
                    isAccessTumblr = false;
                });
            }
        });
    });

    function getTumblrPhotos(func) {

        var d = $.Deferred();

        $.getJSON("https://api.tumblr.com/v2/blog/" + url + "/posts", { api_key: api_key, limit: limit, offset: offset }, function(json) {

            json.response.posts.forEach(function(val, index, array) {
                if ( ! val["photos"] ) {
                    return 1;
                }
                var j    = 0;
                var diffSizes = val.photos[0].alt_sizes.map(function(alt_size) {
                    return {
                        diffWidth: Math.abs(alt_size.width - baseWidth),
                        index    : j++,
                    };
                })

                diffSizes.sort(function(a, b) {
                    if ( a.diffWidth > b.diffWidth ) {
                        return 1;
                    }
                    else if ( a.diffWidth < b.diffWidth ) {
                        return -1;
                    }
                    return 0;
                });

                var altSize = val.photos[0].alt_sizes[diffSizes[0].index]
                var div = '<div class="item"><img src="' + altSize.url+ '" width="' + altSize.width + '" height="' + altSize.height + '" /></div>';
                func(div);
            });

            offset += limit;
            d.resolve();
        });

        return d;
    }

})();
