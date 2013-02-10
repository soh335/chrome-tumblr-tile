$(function() {

    tumblrTile.loadConfig();

    var $apiKey    = $('#setting input[name="apiKey"]');
    var $hostname  = $('#setting input[name="hostname"]');
    var $baseWidth = $('#setting input[name="baseWidth"]');
    var $margin    = $('#setting input[name="margin"]');

    $apiKey.val(tumblrTile.config.apiKey);
    $hostname.val(tumblrTile.config.hostname);
    $baseWidth.val(tumblrTile.config.baseWidth);
    $margin.val(tumblrTile.config.margin);

    $("#setting").submit(function() {
        var hash = {
            apiKey   : $apiKey.val(),
            hostname : $hostname.val(),
            baseWidth: parseInt($baseWidth.val()),
            margin   : parseInt($margin.val())
        };

        tumblrTile.saveConfig(hash);
        return false;
    });
});
