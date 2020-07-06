var counter = 1;
var refreshRate = 60000; // 1 minute
var url = "http://wwc.instacam.com/instacamimg/STNMN/STNMN_l.jpg";

document.addEventListener("DOMContentLoaded", function() {
    var node = document.getElementById("webcam-image");

    setInterval(function() {
    	node.src = url + "?" + counter++;
    }, refreshRate);
});
