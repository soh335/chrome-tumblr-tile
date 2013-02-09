$(function() {

    tumblrTile.loadConfig();

    var $apiKey    = $('#setting input[name="apiKey"]');
    var $hostname  = $('#setting input[name="hostname"]');
    var $baseWidth = $('#setting input[name="baseWidth"]');
    var $column    = $('#setting input[name="column"]');

    $apiKey.val(tumblrTile.config.apiKey);
    $hostname.val(tumblrTile.config.hostname);
    $baseWidth.val(tumblrTile.config.baseWidth);
    $column.val(tumblrTile.config.column);

    $("#setting").submit(function() {
        var hash = {
            apiKey   : $apiKey.val(),
            hostname : $hostname.val(),
            baseWidth: $baseWidth.val(),
            column   : $column.val()
        };

        tumblrTile.saveConfig(hash);
        return false;
    });
});
