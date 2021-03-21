/*
 * sm-viewer
 *
 * This script manages updating the webcam image, the clock, sunrise/sunset, and
 * the weather. Each update uses setInterval, with its interval ID stored in the
 * `intervals` global variable for optional pausing. Written using POJS for
 * maximum compatibility with different browsers. The goal is that this should
 * be usable as a screensaver on *any* device that has a web browser, no matter
 * how limited.
 */

var imgCounter = 0;
var imgRefreshRate = 60000; // 1 minute
var weatherRefreshRate = 600000; // 10 minutes
var weatherFailMaximum = 3; // After this many failed weather updates, hide the weather
var weatherFailCounter = 0;
var imgContainerSelector = "#images";
var oldImg = null;
var newImg = null;
var intervals = {
    images: null,
    time: null,
    sunriset: null,
    weather: null
};

// Image location
//var imgUrl = "http://wwc.instacam.com/instacamimg/STNMN/STNMN_l.jpg";
var imgUrl = "https://shitchell.com/img/stnmn.jpg";
var latitude = 33.804796;
var longitude = -84.148387;

// Weather info
weatherUrl = "https://api.weather.gov/gridpoints/FFC/58,89/forecast/hourly";

/*
 * Determines which event comes next--sunrise or sunset. Then determines the
 * time of the event and updates the banner text.
 */
function updateSunriset() {
    var times = SunCalc.getTimes(new Date(), latitude, longitude);
    var now = new Date();
    var hours = "";
    var minutes = "";

    // Determine which comes next: sunrise or sunset
    if (now > times.sunset || now < times.sunrise) {
        hours = times.sunrise.getHours();
        minutes = times.sunrise.getMinutes();
    } else {
        hours = times.sunset.getHours();
        minutes = times.sunset.getMinutes();
    }

    // Left pad the hour and minutes with '0' if <10
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Set the sunrise/sunset fields
    document.querySelector("#sunriset .time .hour").innerText = hours;
    document.querySelector("#sunriset .time .minute").innerText = minutes;
}

/*
 * Generates a new <img> element using imgUrl with Math.random() appended to
 * prevent caching issues. Tracks the number of images created using imgCounter.
 * For the very first image (on page load), scrolls the image container to the
 * left so that the rightmost side of the image is visible.
 */
function createImg() {
    // Generate a new image using the image counter and a random number to prevent caching issues
    var img = document.createElement("img");
    img.src = `${imgUrl}?${imgCounter}-${Math.random()}`;
    img.classList.add("fwoh");
    // Set the image's z-index to the counter so that it is above previous images
    img.style.zIndex = imgCounter++;
    // On the first run, add an event listener to scroll the image left on load
    if (imgCounter === 1) {
        img.addEventListener('loadend', function() {
            let div = document.getElementById("images");
            div.scrollLeft = img.clientWidth - div.clientWidth;
        });
    }
    return img;
}

/*
 * Adds the "visible" class to a newly generated image and then, after the
 * css transition effect completes, removes the old image.
 */
function transitionImages() {
    // Find how long the fade in transition takes
    const transitionDuration = parseFloat(getComputedStyle(newImg)["transition-duration"]);

    new Promise(function(res) {
        newImg.classList.add("visible");
        setTimeout(function() {
            res(true);
        }, transitionDuration * 1000); // Wait for the transition to complete
    }).then(function() {
        // Delete the old image
        if (oldImg !== null)
        {
            document.querySelector(imgContainerSelector).removeChild(oldImg);
        }
    });
}

/*
 * Replaces the current webcam image with a new image.
 */
function updateImg() {
    oldImg = newImg;
    newImg = createImg();
    // On successful load, transition images
    newImg.addEventListener('load', transitionImages);
    // Log any failed attempts to load the image
    newImg.addEventListener('error', function() {
        console.log("error loading image");
    });

    // Add the new image to the body
    document.querySelector(imgContainerSelector).appendChild(newImg);
    console.log("image update: " + imgCounter);
}

/*
 * Grab the current weather information for Stone Mountain Park and update the
 * banner.
 */
function updateWeather() {
    var temp = "";
    var unit = ""
    var xhr = new XMLHttpRequest();

    xhr.open("GET", weatherUrl);
    xhr.onreadystatechange = function() {

        if (xhr.readyState === 4) { // 4 == request completed
            if (xhr.status == 200) {
                // Convert the request response to JSON
                let requestJSON = JSON.parse(xhr.responseText);

                // Reset the fail counter
                weatherFailCounter = 0;

                // Unhide the weather div if hidden
                document.querySelector("#weather").classList.remove("hidden");

                // Grab the temperature and its unit
                temp = requestJSON.properties.periods[0].temperature;
                unit = requestJSON.properties.periods[0].temperatureUnit;

                // Set the temperature/unit fields
                document.querySelector("#weather .temperature").innerText = temp;
                document.querySelector("#weather .unit").innerText = unit;

                console.log("weather updated");
            } else {
                // Hide the weather div after too many failed updates to prevent
                // showing super outdated weather info
                weatherFailCounter++;
                console.log(`weather update failed (${weatherFailCounter})`);

                if (weatherFailCounter >= weatherFailMaximum) {
                    document.querySelector("#weather").classList.add("hidden");
                    console.log("weather hidden");
                }
            }
        }
    }
    xhr.send();
}

/*
 * Start updating the webcam image
 */
function startUpdatingWebcam() {
    intervals.images = setInterval(function() {
        updateImg();
    }, imgRefreshRate);
}

/*
 * Stop updating the webcam image
 */
function stopUpdatingWebcam() {
    clearInterval(intervals.images);
}

/*
 * Start updating the clock
 */
function startTime() {
    intervals.time = setInterval(function() {
        const time = new Date();
        // Left pad the hour and minutes with '0' if <10
        var hours = time.getHours();
        if (hours < 10) {
            hours = '0' + hours;
        }
        var minutes = time.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        document.querySelector("#clock .hour").innerText = hours;
        document.querySelector("#clock .minute").innerText = minutes;
    }, 1000);
}

/*
 * Stop updating the clock
 */
function stopTime() {
    clearInterval(intervals.time);
}

/*
 * Start updating the sunrise/sunset time
 */
function startSunriset() {
    intervals.sunriset = setInterval(function() {
        updateSunriset()
    }, 1000);
}

/*
 * Stop updating the sunrise/sunset time
 */
function stopSunriset() {
    clearInterval(intervals.sunriset);
}

/*
 * Start updating the weather
 */
function startUpdatingWeather() {
    intervals.weather = setInterval(function() {
        updateWeather();
    }, weatherRefreshRate);
}

/*
 * Stop updating the weather
 */
function stopUpdatingWeather() {
    clearInterval(intervals.weather);
}

/*
 * Fullscreen the page
 */
function fullScreen() {
    var el = document.body;
    req = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
    req.call(el);
}

document.addEventListener("DOMContentLoaded", function() {
    // Fix for chromecast
    if (window.navigator.userAgent.includes("CrKey")) {
        document.body.classList.add("chromecast");
    }

    // I'm just always tryin' to start some shit...
    startTime();
    updateImg();
    updateWeather();
    startUpdatingWebcam();
    startSunriset();
    startUpdatingWeather();

    // Fullscreen on clock tap (until we add settings)
    document.getElementById("banner").onclick = fullScreen;
    document.getElementById("banner").ontouchstart = fullScreen;
});
