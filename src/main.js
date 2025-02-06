//localstorage stuff
if(localStorage.getItem("config") == null) {
    localStorage.setItem("config", JSON.stringify({
        "searchterm": "Kita Ikuyo",
        "limit": 8,
        "length": 1000,
    }));
}
if(localStorage.getItem("bans") == null){
    localStorage.setItem("bans", JSON.stringify([]));
}

//declaring global variables
var config = JSON.parse(localStorage.getItem("config"));
var gif_bans = JSON.parse(localStorage.getItem("bans"));

const apikey = "AIzaSyD5vPuwW0N1ZjgLlkdQNN1rR4CVqMFXqM4";
const clientkey = "my_test_app";
var lmt = config.limit;
var search_limit = lmt;
var search_term = config.searchterm;

var gif_urls = [];
var currentgif = 0;
var intervalId;
var reload = false;


// url Async requesting function
function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);

    return;
}
// callback for the top x GIFs of search
function tenorCallback_search(responsetext) {
    var response_objects = JSON.parse(responsetext);
    top_10_gifs = response_objects["results"];

    for (let i = 0; i < lmt; i++) {
        gif_urls.push(top_10_gifs[i]["media_formats"]["gif"]["url"]);
    }

    /*
    let duplicate_count = 0;

    gif_bans.forEach(element => {
        if(gif_urls.includes(element)) duplicate_count++;
    });

    //if((gif_urls.length - duplicate_count) == search_limit) return;

    //grab_data();*/
}
function grab_data() {
    
    var search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
            apikey +"&client_key=" + clientkey +  "&limit=" + search_limit;

    httpGetAsync(search_url,tenorCallback_search);
    
    return;
}

//gif bans
/*
function remove_gif() {
    gif_bans.push(gif_urls[currentgif]);
    localStorage.setItem("bans", JSON.stringify(gif_bans));
    reload == true;
}
function resetGifBans() {
    gif_bans = [];
    localStorage.setItem("bans", JSON.stringify(gif_bans));
}*/

//settings
function openSettings() {
    document.getElementById("settings").style.display = "block";

    for (let i = 0; i < gif_bans.length; i++) {
        document.getElementById("gifban_display").appendChild(document.createElement('img').src = gif_bans[i]);
    }
    
}

function closeSettings() {
    let newConfig = {
        "searchterm": document.getElementById("searchterm").value,
        "limit": document.getElementById("limit").value,
        "length": document.getElementById("length").value,
    }
    if(newConfig.searchterm !== config.searchterm || 
        newConfig.limit !== config.limit || 
        newConfig.length !== config.length ||
        reload == true){

        localStorage.setItem("config", JSON.stringify(newConfig));
        config = JSON.parse(localStorage.getItem("config"));

        document.getElementById("searchterm").value = config.searchterm;
        document.getElementById("limit").value = config.limit;
        document.getElementById("length").value = config.length;

        lmt = config.limit;
        search_term = config.searchterm;
        gif_urls = [];
        reload = false;

        reload_page();
    }

    document.getElementById("settings").style.display = "none";
}

function reload_page() {
    
    grab_data();

    clearInterval(intervalId);
    currentgif = 0;

    changeBGImage();
    intervalId = setInterval(changeBGImage, config.length);
}

function changeBGImage() {
    document.getElementById("body").style = `background-image: url('${gif_urls[currentgif]}');background-repeat: no-repeat;background-attachment: fixed;background-size: 100% 100%;`;
        if(currentgif<(gif_urls.length-1)) {currentgif++;}
    else {currentgif=0}
}

window.onload = function () {

    window.addEventListener("focus", openSettings);
    window.addEventListener("blur", closeSettings);

    document.getElementById("searchterm").value = config.searchterm;
    document.getElementById("limit").value = config.limit;
    document.getElementById("length").value = config.length;
    
    reload_page();

}
