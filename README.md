[JQuery WebRating](https://googledrive.com/host/0B8w_x363egOiZEVrS2FMVGU4MUk/index.html)
======

##Demo
1. <a href="https://googledrive.com/host/0B8w_x363egOiZEVrS2FMVGU4MUk/index.html" target="_blank">BigStar</a>
2. <a href="https://googledrive.com/host/0B8w_x363egOiZEVrS2FMVGU4MUk/index.html" target="_blank">Star</a>
3. <a href="https://googledrive.com/host/0B8w_x363egOiZEVrS2FMVGU4MUk/index.html" target="_blank">Hearts</a>
4. <a href="https://googledrive.com/host/0B8w_x363egOiZEVrS2FMVGU4MUk/index.html" target="_blank">Smile</a>

###Features
- **Easy** to configure
- Precision upto **0.01**
- Use **stars, hearts, smiles** or your logo
- Integrate with your **own database**
- **CSS** based coloring
- Customized **toop-tip option**
- **Callback** functions on click & hover
- Limit **number of clicks** per page view
- Use **cookies** to limit clicks per visitor

###How to use WebRating
####Step 1
Start with creating static or dyanmic div elements. Add "data-webRating" attribute to those divs which will include the ratings.
```HTML
  <div class="divClass" data-webRating="2.5" data-webRatingN="5" data-webRatingArg='{"type":"book","uid":12}'></div>
```

####Step 2
Include WebRating plugin to your page.
```Javascript
<script type="text/javascript" src="js/jquery.webRating.js"></script>
<!-- or -->
<script type="text/javascript" src="js/jquery.webRating.min.js"></script>
```

####Step 3
WebRating will automatically detect relevant div elements checking for "data-webRating" argument. Just initialize the plugin with desired settings to display ratings for products, blogs, services.
```Javascript
jQuery("div").webRating({     
        // count
        ratingCount     : 5,

        // image & color
        imgSrc          : "generalIcons.png",
        xLocation     	: 53, //in px
        yLocation	      : 49, //in px
        width		        : 15, //in px
        height          : 15, //in px

        //CSS
        onClass         : 'onClass',
        offClass        : 'offClass',
        onClassHover  	: 'onClassHover', //Optional
        offClassHover 	: 'offClassHover' //Optional

        //on click funcitons
        cookieEnable		: false,
        cookiePrefix		: "myRating_",
        maxClick				: 1,
        onClick					: function(clickScore, data){
            //Your function & post action
        },

        //Tooltip
        tp_showAverage  : true,
        prefixAverage   : "Avg",
        tp_eachStar     : {'1':'Very Bad','2':'Bad','3':'Ok','4':'Good','5':'Very Good'} //Rating guide
}); 
```

###Parameters

| Name | Compulsory |  Default | Description |  
|:------------- | :-----------: | :-------------: | :----------- |
| bind  | *optional* | 'load' | **load** will display all ratings after the page is ready. Use **event** to link display to particular event|
| ratingCount  | *optional* | 5 | Max rating for given set|
| imgSrc  | *requried* | null | Source *.png* image file|
| xLocation  | *requried* | 0 | x-coordinate of the desired icon in the image file (in px)|
| yLocation  | *requried* | 0 | y-coordinate of the desired icon in the image file (in px)|
| width  | *requried* | 0 | width of the desired icon in the image file (in px)|
| height  | *requried* | 0 | height of the desired icon in the image file (in px)|
| onClass  | *requried* | null | CSS for active segment|
| offClass  | *requried* | null | CSS for non-active segment|
| onClassHover  | *requried* | null | On mouse hover CSS for active segment|
| offClassHover  | *requried* | null | On mouse hover CSS for non-active segment|
| autoParentWidth  | *optional* | true | Width of the parent div will be set automatically by plugin|
| onClick  | *optional* | null  | Callback function to be called when user clicks on any rating. Function has two paramenters - 1. Rating Score 2. Call back arguments supplied with div|
| onHover  | *optional* | null  | Callback function to be called when user hovers on any rating. Function has two paramenters - 1. Hover Score 2. Call back arguments supplied with div|
| attribute  | *optional* | "data-webRatingArg"  | DOM element attribute that will be used to get callback function 2nd argument.|
| score  | *required* | "data-webRating"  | DOM element attribute that will be used to get active average rating.|
| count  | *optional* | "data-webRatingN" | DOM element attribute that will be used to get active count (N).|
| maxClick  | *optional* | 1  | Max allowed user clicks per rating div.|
| cookieEnable  | *optional* | true | Cookies will be used to limit clicks per visits|
| cookieLifeDays  | *optional* | 1 | Cookies life in days|
| prefixAverage  | *optional* | 'Avg' | Prefix fool tool-tip for showing average|
| tp_showAverage | *optional* | true | Show average rating using toop-tip |
| tp_showMaxScore | *optional* | true  | Show max rating using toop-tip |
| tp_showCount  | *optional* | true  | Show rating count (N) using toop-tip |
| tp_eachStar  | *optional* | true  | Text that is to be applied to each rating. Eg. 1st Star can have "Ok" displayed while rating. See demo for more info. |
| updateScore  | *optional* | true  | Update rating after user inputs new rating.|
