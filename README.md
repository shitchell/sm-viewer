# sm-viewer

A simple page to view the webcam atop Stone Mountain. The webcam updates about every 3 minutes; this page updates every minute to make sure it gets the most recent picture without adding too much load.

https://shitchell.github.io/sm-viewer/

### Features

1. Automatically fits image to screen based on aspect ratio using [fwoh.js](https://github.com/shitchell/fwoh)
2. Clock
3. Upcoming sunrise or sunset time (whichever is next)
4. Updates every ~3 minutes (refresh rate is 60 seconds, but the webcam itself updates randomly every 2-4 minutes)

### TODO

- [x] Add transition between updates
- [x] Add clock
- [ ] Add timeline box to see previous images
- [ ] Check last modified time to only update image when the image has changed
- [ ] Add option to change webcam url
- [ ] Add sliders to adjust banner position
- [ ] Add option to hide the banner
- [ ] Add option to determine what information is displayed on the banner
