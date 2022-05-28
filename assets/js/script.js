// need to grab current weather and display it and then log lat and lon and then use one call to get daily forecast stuff - need to test this
var searches
var searchFormEl = document.querySelector(".main-btns")
var clearHistoryBtn = document.querySelector("#clear")
var searchHistoryEl = document.getElementById("history-container");
var searchHandle = function(event) {

}


var grabData = function (city) {
    var API_KEY = 'a7243de9e3a64e60260334e5eb3350ef'
    url = 'https://api.openweathermap.org/data/2.5/weather?q=' +city+'&appid='+API_KEY;
    fetch(url)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            console.log(data);
            saveSearch(city)
            displayWeather(data);
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
var displayWeather = function() {

}

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

var viewSearchHistory = function() {
    var searchHistoryEl = document.getElementById("history-container");
    searchHistoryEl.replaceChildren()
    if (localStorage.getItem("searches")) {
        var searchArr = JSON.parse(localStorage.getItem("searches"));
        for (var i = 0; i < searchArr.length; i++) {
            var searchItem = document.createElement("button");
            searchItem.value = searchArr[i];
            searchItem.textContent = searchArr[i];
            searchItem.classList = "history-btn btn btn-sm btn-secondary btn-block";
            searchHistoryEl.appendChild(searchItem);
        }
}
}

var clearHistory = function() {
    localStorage.removeItem("searches");
    searchHistoryEl.replaceChildren()
}
searchFormEl.addEventListener("click", function(event) {
    event.stopPropagation()
    event.preventDefault();
    var btnChoiceId = event.target.getAttribute("id");
    if (btnChoiceId == "clear") {
        clearHistory()
    }
    else {
        var searchInputEl = document.getElementById('search-input');
        grabData(searchInputEl.value);
        saveSearch(searchInputEl.value)
        searchInputEl.value ='';
    }
})
searchHistoryEl.addEventListener("click", function(event) {
    event.stopPropagation()
    grabData(event.target.value)
})
viewSearchHistory();