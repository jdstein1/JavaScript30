# 19. Web Cam Fun!

## About

1. Access client video and audio media inputs and output to web page.
1. Snap still image of video output to save for download.
1. Manipulate video output with video effects functions.

## TODO:

* User Interactions
    * [X] Enable/disable "clear" buttons
    * [X] Enable/disable "snap" button
    * [X] Hide alert message
* Styling
    * [X] Style the buttons (status)
    * [X] Style the alerts
    * [X] Style the inputs
    * [X] Style the labels
    * [] Make a cool skin/theme:
        * [bootstrap](https://getbootstrap.com/)
        * [material design](https://material.io/guidelines/)
        * [awwwards](http://www.awwwards.com/)
            * [30 Recent Inspirational UI Examples in Mobile Device Screens](http://www.awwwards.com/30-recent-inspirational-ui-examples-in-mobile-device-screens.html)
        * [webdesign inspiration](http://www.webdesign-inspiration.com/)
* Effects
    * Chroma Key
        * [] Redo inputs w a single HTML5 color input
        * [] Display the colors that the inputs represent
    * Colorize
        * [X] Make RGB colorize effect work again
        * ~~[] Build separate function for random~~
        * [X] Pass array of numbers in from videoFX function to use single colorize function
    * Split
        * [X] Make color channel split function work
    * Pixelate
        * [] Make pixelate effect function work
* Structure
    * [X] Move CSS and JS to folders
* Misc
    * [X] Fix snapshot limit
    * [X] Add background image (animated?  fractal?  tv static?) to show thru chroma key
    * [X] Toggle buttons w utils.js function
    * [] Move other common stuff to utils.js
    * [] Set W&H dimensions of video picture in canvas so it is not distorted
        * [] Get native resolution
    * [] Custom "hide()" and "show()" function break when element passed has children (i.e., Select/Option).
