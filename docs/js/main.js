var counter = 1;
var refreshRate = 60000; // 1 minute
var url = "http://wwc.instacam.com/instacamimg/STNMN/STNMN_l.jpg";
var imgContainer = document.getElementById("images");
var oldImg = null;
var newImg = null;
var imgUpdater = null;
var timeUpdater = null;

function createImg() {
	var img = document.createElement("img");
	img.src = url + "?" + counter + Math.random();
	img.style.zIndex = counter++;
	return img;
}

function transitionImages() {
	// Find how long the transition takes
	const transitionDuration = parseFloat(getComputedStyle(newImg)["transition-duration"]);

	new Promise(res => {
		newImg.classList.add("visible");
		setTimeout(() => {
			res(true);
		}, transitionDuration * 1000); // Wait for the transition to complete
	}).then(function() {
		// Delete the old image
		if (oldImg !== null)
		{
			imgContainer.removeChild(oldImg);
		}
	});
}

function updateImg() {
	// Replace the current old image with a new invisible image
	oldImg = newImg;
	newImg = createImg();
	newImg.addEventListener('load', transitionImages)
	newImg.addEventListener('error', function() {
		console.log("error loading image");
	})

	// Add the new image to the body
	imgContainer.appendChild(newImg);
	console.log("updating image");
}

function startUpdating() {
	imgUpdater = setInterval(() => {
		updateImg();
	}, refreshRate);
}

function stopUpdating () {
	clearInterval(imgUpdater);
}

function startTime() {
	timeUpdater = setInterval(() => {
		const time = new Date();
		document.querySelector("#clock .hour").innerText = time.getHours();
		document.querySelector("#clock .minute").innerText = time.getMinutes();
	}, 1000);
}

function stopTime() {
	clearInterval(timeUpdater);
}

document.addEventListener("DOMContentLoaded", function() {
	startTime();
	updateImg();
	startUpdating();
});
