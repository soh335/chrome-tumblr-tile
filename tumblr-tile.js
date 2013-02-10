var tumblrTile;

tumblrTile || (function() {

    tumblrTile = {
        configNs       : "tumblr-tile",
        saveConfig     : saveConfig,
        loadConfig     : loadConfig,
        draw           : draw,
        getTumblrPhotos: getTumblrPhotos,
        config         : undefined,
    };

    function saveConfig(hash) {
        localStorage[this.configNs] = JSON.stringify(hash);
    }

    function loadConfig() {
        var configStr = localStorage[this.configNs];
        var config    = configStr ? JSON.parse(configStr) : {};

        var defaultConfig = {
            hostname : "aoi-miyazaki.tumblr.com",
            baseWidth: 250,
            margin   : 10
        };

        this.config = $.extend(defaultConfig, config);
    }

    function draw() {
        var self = this;

        self.loadConfig();

        if ( ! self.config.apiKey ) {
            console.log("not exists api key");
            return 1;
        }

        var param = {
            limit : 20,
            offset: 0,
        };

        var isAccessTumblr = false;

        self.getTumblrPhotos(param, function(div) {
            $("#container").append($(div));
        }).then(function() {

            param.offset += param.limit;

            $("#container").masonry({
                itemSelector: ".item",
                columnWidth: self.config.baseWidth + self.config.margin,
                isFitWidth: true,
                isAnimated: true
            });
        }).then(function() {
            $(window).scroll(function() {
                if ( isAccessTumblr == false && $(window).scrollTop() + $(window).height() >= $(document).height() ) {

                    isAccessTumblr = true;
                    var divs = "";

                    self.getTumblrPhotos(param, function(div) {
                        divs += div;
                    }).then(function() {

                        param.offset += param.limit;

                        var $divs = $(divs);
                        $("#container").append($divs).masonry( 'appended', $divs, false );
                    }).then(function() {
                        isAccessTumblr = false;
                    });
                }
            });
        });

    }

    function getTumblrPhotos(param, func) {

        var self = this;
        var d = $.Deferred();
        param.api_key = self.config.apiKey;

        $.getJSON(
            "https://api.tumblr.com/v2/blog/" + self.config.hostname + "/posts/photo",
            param,
            function(json) {

                json.response.posts.forEach(function(val, index, array) {
                    if ( ! val.photos ) {
                        return 1;
                    }
                    var j    = 0;
                    var diffSizes = val.photos[0].alt_sizes.map(function(alt_size) {
                        return {
                            diffWidth: Math.abs(alt_size.width - self.config.baseWidth),
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

                d.resolve();
            }
        );

        return d;
    }

})();
