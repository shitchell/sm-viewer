var counter = 1;
var refreshRate = 60000; // 1 minute
var url = "http://wwc.instacam.com/instacamimg/STNMN/STNMN_l.jpg";
var oldImg = null;
var newImg = null;
var updater = null;

function createImg() {
	var img = document.createElement("img");
	img.src = url + "?" + counter + Math.random();
	img.style.zIndex = counter++;
	return img;
}

async function updateImg() {
	// Replace the current old image with a new invisible image
	oldImg = newImg;
	newImg = createImg();

	// Add the new image to the body
	document.body.appendChild(newImg);
	// Wait for it to load
	while (!document.body.contains(newImg))
	{
		await new Promise(res => {
			requestAnimationFrame(resolve)
		});
	}

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
			document.body.removeChild(oldImg);
		}
	});

}

function startUpdating() {
	updater = setInterval(() => {
		updateImg();
	}, refreshRate);
}

function stopUpdating () {
	clearInterval(updater);
}

document.addEventListener("DOMContentLoaded", function() {
	updateImg();
	startUpdating();
});
