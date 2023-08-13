# Pixel Jump

HTML 2D vertical scroller game:

* Beat each level by making it to the top
* Collect gems to earn health
* Kill enemies to earn points

## Browser Support

Only tested and working on Mac Chrome (probably works on Windows Chrome).

Audio is broken on iOS Safari (probably other browsers), including audio events, which the game relies upon. This can probably be fixed:

* https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari

More critically, canvas filters, which the game relies upon, are not supported by some browsers, including Webkit browsers:

* https://github.com/WebKit/WebKit/pull/3793
* https://caniuse.com/mdn-api_canvasrenderingcontext2d_filter

That being said, I have implemented on-screen controls when a mobile browser is detected in case these issues are ever resolved.

## Play Now

The latest version can be played here:

https://chrisworman.github.io/jump-game/

## Screenshot

![Screenshot 2023-08-03 at 2 52 46 PM](https://github.com/chrisworman/jump-game/assets/5204921/d20d2824-3ccb-4fa8-bca9-91c6baf05212)
