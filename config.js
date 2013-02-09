$(document).ready(function() {

  var configStr = localStorage['tumblr-tile'];
  var configJson = configStr ? JSON.parse(configStr) : {};

  console.log(configJson);

  var $apiKey = $('#setting input[name="apiKey"]');
  var $hostname = $('#setting input[name="hostname"]');
  var $baseWidth = $('#setting input[name="baseWidth"]');
  var $column = $('#setting input[name="column"]');

  if ( configJson ) {
      $apiKey.val(configJson.apiKey);
      $hostname.val(configJson.hostname);
      $baseWidth.val(configJson.baseWidth);
      $column.val(configJson.column);
  }

  $("#setting").submit(function() {
    var config = {
      apiKey: $apiKey.val(),
      hostname: $hostname.val(),
      baseWidth: $baseWidth.val(),
      column: $column.val()
    };
    localStorage['tumblr-tile'] = JSON.stringify(config);
    return false;
  });
});
