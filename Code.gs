var prop = PropertiesService.getScriptProperties().getProperties();

function getToken() {
  var endpoint = 'https://accounts.spotify.com/api/token'
  var text = prop.CLIENT_ID + ':' + prop.CLIENT_SECRET;
  var encode = Utilities.base64Encode(text, Utilities.Charset.UTF_8);
  var options = {
    'method': 'post',
    'contentType': 'application/x-www-form-urlencoded',
    'headers': {
      'Authorization': 'Basic ' + encode
    },
    'payload': {
      'grant_type': 'refresh_token',
      'refresh_token': prop.REFRESH_TOKEN
    },
    'muteHttpExceptions': true
  }
  var response = UrlFetchApp.fetch(endpoint, options)
  var content = response.getContentText("UTF-8")
  return JSON.parse(content).access_token
}

function doGet(){ 
  var template = HtmlService.createTemplateFromFile("index").evaluate();
  return template;
}

function doPost(e) {
  var url = e.parameter.input_url;
  var template = HtmlService.createTemplateFromFile("res");
  if (url.match('episode')){
    var output_text = getMetadataEpisode(url);
  }
  else if (url.match('album')){
    var output_text = getMetadataAlbum(url);
  }
  else if (url.match('track')){
    var output_text = getMetadataTrack(url);
  }
  else {
    var output_text = "invalid request";
  }
  template.val = output_text
  return template.evaluate()
}

function getMetadataEpisode(url) {
  var access_token = getToken()
  var idx_start = url.indexOf('episode') + 'episode'.length + 1
  var idx_end = url.indexOf('?si')
  var id_str = url.slice(idx_start, idx_end)
  var options = {
  'headers': {   'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization': 'Bearer ' + access_token },
  'muteHttpExceptions': true 
};
  fetch_url = 	'https://api.spotify.com/v1/episodes/' + id_str
  const response =  UrlFetchApp.fetch(fetch_url, options)
  const parsedResponse = JSON.parse(response);
  const episode_name = parsedResponse.name;
  const show_name = parsedResponse.show.name;
  return episode_name + ' / ' + show_name　+ ' ' + url
}

function getMetadataAlbum(url) {
  var access_token = getToken()
  var idx_start = url.indexOf('album') + 'album'.length + 1
  var idx_end = url.indexOf('?si')
  var id_str = url.slice(idx_start, idx_end)
  var options = {
  'headers': {   'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization': 'Bearer ' + access_token },
  'muteHttpExceptions': true 
};
  fetch_url = 	'https://api.spotify.com/v1/albums/' + id_str
  const response =  UrlFetchApp.fetch(fetch_url, options)
  const parsedResponse = JSON.parse(response);
  const album_name = parsedResponse.name;
  const artist_name = parsedResponse.artists[0].name;
  return album_name + ' / ' + artist_name　+ ' ' + url
}

function getMetadataTrack(url) {
  var access_token = getToken()
  var idx_start = url.indexOf('track') + 'track'.length + 1
  var idx_end = url.indexOf('?si')
  var id_str = url.slice(idx_start, idx_end)
  var options = {
  'headers': {   'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization': 'Bearer ' + access_token },
  'muteHttpExceptions': true 
};
  fetch_url = 	'https://api.spotify.com/v1/tracks/' + id_str
  const response =  UrlFetchApp.fetch(fetch_url, options)
  const parsedResponse = JSON.parse(response);
  const track_name = parsedResponse.name;
  const artist_name = parsedResponse.artists[0].name;
  return track_name + ' / ' + artist_name　+ ' ' + url
}