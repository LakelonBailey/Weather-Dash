var searches
var searchFormEl = document.querySelector("#search-form")
var clearHistoryBtn = document.querySelector("#clear")
var searchHistoryEl = document.getElementById("history-container");
var API_KEY = 'a7243de9e3a64e60260334e5eb3350ef'
var city
const date = new Date();

// This function automatically displays the current date and the of the next five days upon loading into the website. 
var displayDates = function() {
    document.getElementById("name-date").textContent = date.toDateString().substring(4);
    for (var i = 1; i<=5; i++) {
        var newDate = new Date();
        newDate.setDate(date.getDate() + i)
        document.getElementById("date-" + i).textContent = newDate.toDateString().substring(4);
    }
}

// This function uses the Current Weather API to obtain weather data on a specific city
var grabData = function () {
    var API_KEY = 'a7243de9e3a64e60260334e5eb3350ef'
    url = 'https://api.openweathermap.org/data/2.5/weather?q=' +city+'&appid='+API_KEY;
    fetch(url)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            saveSearch(city)
            city = data.name;
            switchAPI(data);
            })
        }
        else {
            alert("Error: City Not Found")
        }
    })
    .catch(function(error) {
        alert("Error")
    })
    
}
// This function uses the data from the grabData function to determine the city's longitude and latitude and then call the One Call API in order to obtain forecast information.
var switchAPI = function(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var newCallUrl = ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon+"&exclude=alerts&units=imperial&appid="+API_KEY);
    fetch(newCallUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            displayCurrent(data);
            displayFuture(data);
        })
    })
}

// This function displays weather data for the current day.
var displayCurrent = function(data) {
    var uvColors = ["#2ECC71", "#D1FF33","#FCFF33", "#FFD133", "#FF9F33","#FF7A33","#FF3333","#C74A4A","#C74A92","#FF00FF"];
    document.getElementById("name-date").textContent = city + ' (' + date.toDateString() + ')';
    document.getElementById("icon").setAttribute('src', 'http://openweathermap.org/img/wn/'+ data.current.weather[0].icon +'@2x.png');
    document.getElementById("temp").textContent = "Temp: " + data.current.temp + " ˚F";
    document.getElementById("wind").textContent = "Wind: " + data.current.wind_speed + " mph";
    document.getElementById("humid").textContent = "Humidity: " + data.current.humidity + "%";
    var uvIndex = data.current.uvi;
    var uvColorIndex = Math.round(uvIndex);
    if (uvColorIndex > 9) {
        uvColorIndex = 9;
    }
    var uvColor = uvColors[uvColorIndex];
    document.getElementById("uv").textContent = uvIndex
    document.getElementById("uv").style.backgroundColor = uvColor;
}

// This function displays weather data for the next 5 days. 
var displayFuture = function(data) {
    var daysArr = data.daily;
    for (var i = 0; i<daysArr.length; i++) {
        document.getElementById("icon-" + (i+1)).setAttribute('src', 'http://openweathermap.org/img/wn/'+ daysArr[i].weather[0].icon +'@2x.png')
        document.getElementById("temp-"+(i+1)).textContent = "Temp: " + daysArr[i].temp.day + " ˚F";
        document.getElementById("wind-"+(i+1)).textContent = "Wind: " + daysArr[i].wind_speed + " MPH";
        document.getElementById("humid-"+(i+1)).textContent = "Humidity: " + daysArr[i].humidity + "%";
    }
}

// This function saves a search term to the search history if it is a new term. 
var saveSearch = function(newSearch) {
    storedSearches = localStorage.getItem("searches");
    if (storedSearches) {
        var isNewSearch = true;
        searches = JSON.parse(storedSearches);
        for (var i = 0; i<searches.length; i++) {
            if (searches[i] == newSearch) {
                isNewSearch = false
            }
        }
        if (isNewSearch) {
            searches.push(newSearch)
        }
    }
    else {
        searches = [];
        searches.push(newSearch);
    }
    localStorage.setItem("searches", JSON.stringify(searches))
    viewSearchHistory()
}

// This function displays all search history
var viewSearchHistory = function() {
    var searchHistoryEl = document.getElementById("history-container");
    searchHistoryEl.replaceChildren()
    if (localStorage.getItem("searches")) {
        var searchArr = JSON.parse(localStorage.getItem("searches"));
        for (var i = 0; i < searchArr.length; i++) {
            var searchItem = document.createElement("button");
            searchItem.value = searchArr[i];
            searchItem.textContent = searchArr[i];
            searchItem.classList = "history-btn btn btn-secondary btn-block";
            searchHistoryEl.appendChild(searchItem);
        }
    }
}

// This function clears search history
var clearHistory = function() {
    localStorage.removeItem("searches")
    viewSearchHistory()
}

// This event listener waits for a click of the search button and clear history button
searchFormEl.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    var btnChoiceId = event.target.getAttribute("id");
    if (btnChoiceId == "clear") {
        clearHistory();
    }
    else {
        var searchInputEl = document.getElementById('search-input');
        if (searchInputEl.value != '') {
            city = searchInputEl.value;
            grabData();
            searchInputEl.value ='';
        }
        else {
            alert('Please Enter a City Name')
        }
        
    }
})

// This event listener waits for a click from one of the search history items. 
searchHistoryEl.addEventListener("click", function(event) {
    event.preventDefault()
    event.stopPropagation()
    city = event.target.value
    grabData()
})

displayDates();
viewSearchHistory();


