
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i = 3; i < nodeArgv.length; i++) {
  if (i > 3 && i < nodeArgv.length) {
    x = x + " " + nodeArgv[i];
  } else {
    x = x + nodeArgv[i];
  }
}

//switch case
switch (command) {
  case "my-tweets":
    showTweets();
    break;

  case "spotify-this-song":
    if (x) {
      spotifySong(x);
    } else {
      spotifySong("The Sign");
    }
    break;

  case "movie-this":
    if (x) {
      showMovies(x)
    } else {
      showMovies("Mr. Nobody")
    }
    break;

  case "do-what-it-says":
    doThing();
    break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song 'movie name here!', movie-this 'movie-name-here'}");
    break;
}

function spotifySong(song) {
  spotify.search({ type: 'track', query: song }, function (error, data) {
    if (!error) {
      for (var i = 0; i < data.tracks.items.length; i++) {
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name + "\nSong: " + songData.name +
          "\nPreview URL: " + songData.preview_url + "\nAlbum: " + songData.album.name +
          "\n-----------------------");

        //   //adds text to log.txt
         fs.appendFile('log.txt',"Artist: " + songData.artists[0].name + "\nSong: " + songData.name +
          "\nPreview URL: " + songData.preview_url + "\nAlbum: " + songData.album.name +
          "\n-----------------------", function(error, data) {
            if (error) {
              console.log(error)
            }
            
          });
      }
    } else {
      console.log('Error occurred.' + error);
    }
  });
}

function showTweets() {
  //Display last 20 Tweets
  var screenName = { screen_name: 'DjeDjeShow' };
  client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log("@DjeDjeShow: " + tweets[i].text + " Created At: " + date.substring(0, 19) +
          "\n-----------------------");

        // adds text to log.txt file
        fs.appendFile('log.txt', "@DjeDjeShow: " + tweets[i].text + " Created At: " + date.substring(0, 19) +
                                 "\n-----------------------");
      }
    } else {
      console.log('Error occurred');
    }
  });
}

function showMovies(movie) {
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy';

  request(omdbURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body);

      console.log("Title: " + body.Title + "\nRelease Year: " + body.Year +
        "\nIMdB Rating: " + body.imdbRating + "\nCountry: " + body.Country +
        "\nLanguage: " + body.Language + "\nPlot: " + body.Plot + "\nActors: " + body.Actors);

      // //adds text to log.txt
       fs.appendFile('log.text',"Title: " + body.Title + "\nRelease Year: " + body.Year +
      "\nIMdB Rating: " + body.imdbRating + "\nCountry: " + body.Country + 
      "\nLanguage: " + body.Language + "\nPlot: " + body.Plot + "\nActors: " + body.Actors, function(error, data){
        if(error){
          console.log(error);
        }
      });

    } else {
      console.log('Error occurred.')
    }
    if (movie === "Mr. Nobody") {
      console.log("\n-----------------------" +
        "\nIf you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +
        "\nIt's on Netflix!");

      // //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------" +
      "\nIf you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +
       "\nIt's on Netflix!", function(error, data){
         if(error){
           console.log(error);
         }
       });
    }
  });

}

function doThing() {
  fs.readFile('random.txt', "utf8", function (error, data) {
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}