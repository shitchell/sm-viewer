var counter = 1;
var refreshRate = 60000; // 1 minute
var url = "http://wwc.instacam.com/instacamimg/STNMN/STNMN_l.jpg";
var imgContainerSelector = "#images";
var oldImg = null;
var newImg = null;
var imgUpdater = null;
var timeUpdater = null;

function createImg() {
    // Generate a new image using the counter and a random number to prevent caching issues
    var img = document.createElement("img");
    img.src = url + "?" + counter + Math.random();
    // Set the image's z-index to the counter so that it is above previous images
    img.style.zIndex = counter++;
    return img;
}

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

function updateImg() {
    // Replace the current old image with a new invisible image
    oldImg = newImg;
    newImg = createImg();
    // On successful load, transition images
    newImg.addEventListener('load', transitionImages)
    // Log any failed attempts to load the image
    newImg.addEventListener('error', function() {
        console.log("error loading image");
    })

    // Add the new image to the body
    document.querySelector(imgContainerSelector).appendChild(newImg);
    console.log("updating image");
}

function startUpdating() {
    imgUpdater = setInterval(function() {
        updateImg();
    }, refreshRate);
}

function stopUpdating () {
    clearInterval(imgUpdater);
}

function startTime() {
    timeUpdater = setInterval(function() {
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

function stopTime() {
    clearInterval(timeUpdater);
}

function fullScreen() {
    var el = document.body;
    req = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
    req.call(el);
}

document.addEventListener("DOMContentLoaded", function() {
    startTime();
    updateImg();
    startUpdating();

    // Fullscreen on clock tap (until we add settings)
    document.getElementById("clock").onclick = fullScreen;
    document.getElementById("clock").ontouchstart = fullScreen;
});
