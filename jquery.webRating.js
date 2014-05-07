/*!
 * jQuery WebRating - v1.0.03
 *
 * Copyright 2014, Piyush Ramuka
 *
 * Dual licensed under the MIT and GPL v2 licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * jQuery("div").webRating();
 */
;(function($, window, document, undefined)
{
    $.fn.webRating = function(settings)
    {
        /**
         * settings and configuration data
         * @type {}
         */
        var configuration =
        {
            // general
            bind            : "load",

            // image & color
            ratingCount     : 5,
            imgSrc	    : null,
            xLocation       : 0,  //in px
            yLocation       : 0,  //in px
            width	    : 0,  //in px
            height	    : 0,  //in px

            //CSS
            onClass         : null,
            offClass        : null,
            onClassHover    : null,
            offClassHover   : null,
            autoParentWidth : true,

            //cookie
            cookieEnable    : true,
            cookieLifeDays  : 1,
            cookiePrefix    : "webRating_",

            //Tooltip
            prefixAverage   : "Avg",
            tp_showAverage  : true,
            tp_showMaxScore : true,
            tp_showCount    : true,
            tp_eachStar     : null,

            //Maths
            updateScore	    : true,

            //click
            maxClick        : 1,
            onClick	    : null,
            onHover         : null,

            // attribute
            attribute       : "data-webRatingArg",
            score           : "data-webRating", //Current rating
            count           : "data-webRatingN" //Current count
        };

        // overwrite configuration with custom user settings
        if( settings ) $.extend(configuration, settings);

        // all given items by jQuery selector
        var items = this;

        //Constants
        var minus = '-';
        var px  = 'px';
        var per = '%';

        /**
        * Update prefixAverage with proper space
        */
        var _ratingAvgPrefix = configuration.prefixAverage.trim();
        if(_ratingAvgPrefix.length > 0){
                configuration.prefixAverage = configuration.prefixAverage.trim() + " ";
        }
        else{
                configuration.prefixAverage = "";
        }

        // on first page load get initial images
        if( configuration.bind == "load" ) $(window).load(_init);

        // if event driven don't wait for page loading
        else if( configuration.bind == "event" ) _init();
				
        /**
        */
        function drawRatingStar(){
            // Basic testing
            if(!!configuration.imgSrc == false) return;
            if(configuration.ratingCount == 0) return;

            //Class test
            if(!!configuration.onClassHover == false){
                configuration.onClassHover = configuration.onClass;
            }
            
            if(!!configuration.offClassHover == false){
                configuration.offClassHover = configuration.offClass;
            }

            // cleanup all items which are already loaded or don't have attribute parameter
            items = $(items).filter(function(){
                var element = $(this);
                return (!(element.data('loaded')) && (element.attr(configuration.score)));
            });

            //Preload Image
            var imageObj = $(new Image());
            imageObj.attr("src", configuration.imgSrc);

            //process each div element
            var cookieIndex = 0;
            items.each(function(){
                //Element
                var element = $(this);
                element.data('loaded', true);

                //Math
                var score = +element.attr(configuration.score);
                var count = +element.attr(configuration.count);
                var argCallback = element.attr(configuration.attribute);

                //Create background div
                var bgDiv = document.createElement("div");
                bgDiv.id = "bgDiv";
                bgDiv.style.width = (configuration.width * configuration.ratingCount) + px;
                bgDiv.style.height = (configuration.height) + px;

                //Set parent width
                if(configuration.autoParentWidth){
                    this.style.width = bgDiv.style.width;
                }

                //Tool tip average
                _addRatingAvgTp($(bgDiv), score, count);

                //Data data in object
                $(bgDiv).data('clickCount', 0);
                $(bgDiv).data('score', score);
                $(bgDiv).data('count', count);
                $(bgDiv).data('argCallback', argCallback);
                $(bgDiv).data('cookieIndex', cookieIndex++);

                //Create on div
                var onDiv = document.createElement("div");
                onDiv.id = "onDiv";
                onDiv.setAttribute('class', configuration.onClass);
                bgDiv.appendChild(onDiv);
                onDiv.style.width = _getOnPercentage(score);
                onDiv.style.height = (configuration.height) + px;
                onDiv.style.cssFloat = "left";

                //Create off div
                var offDiv = document.createElement("div");
                offDiv.id = "offDiv";
                offDiv.setAttribute('class', configuration.offClass);
                bgDiv.appendChild(offDiv);
                offDiv.style.width = _getOffPercentage(score);
                offDiv.style.height = (configuration.height) + px;
                offDiv.style.cssFloat = "left";

                //Star container
                var starContainer = document.createElement("div");
                starContainer.id = "starParent";
                starContainer.setAttribute("style", "position: absolute;");
                starContainer.style.textAlign = "left";

                bgDiv.appendChild(onDiv);
                bgDiv.appendChild(offDiv);
                bgDiv.appendChild(starContainer);
                element.append(bgDiv);

                //Insert start in each div
                for(var i = 0; i < configuration.ratingCount; i++){
                    //Star Div
                    var starDiv = document.createElement("div");
                    starDiv.id = i + 1;
                    starDiv.style.width = (configuration.width) + px;
                    starDiv.style.height = (configuration.height) + px;
                    starDiv.style.cssFloat = "left";

                    //Add tool tip
                    if (configuration.tp_eachStar) {
                        if (configuration.tp_eachStar[i + 1]) {
                            starDiv.title = configuration.tp_eachStar[i + 1];
                        }
                    }

                    //Star Image
                    var starImg = document.createElement("img");
                    starImg.setAttribute("src", imageObj.attr("src"));
                    starImg.style.marginLeft = minus + configuration.xLocation + px;
                    starImg.style.marginTop = minus + configuration.yLocation + px;
                    starImg.style.clip = "rect(" + configuration.yLocation + "px," +
                            (+configuration.xLocation + +configuration.width) + "px,"
                            + (+configuration.yLocation + +configuration.height) + "px," + configuration.xLocation + "px)";

                    starImg.style.position = "absolute";
                    starImg.style.maxWidth = 'none';
                    starDiv.appendChild(starImg);
                    starContainer.appendChild(starDiv);
                }

                //Return if not clicks allowed
                if (_ratingRemainingClick($(bgDiv)) < 1) {
                    _removeRatingStarTitle($(starContainer));
                    return;
                }

                //Add hover effect
                $(starContainer).on({
                    mouseover: function() {
                        //Check if maximum rating as been made
                        if (_ratingRemainingClick($(bgDiv)) < 1) {
                            _removeRatingStarTitle($(starContainer));
                            return;
                        }

                        //Maths
                        var hoverScore = $(this).attr("id");
                        onDiv.style.width = _getOnPercentage(hoverScore);
                        offDiv.style.width = _getOffPercentage(hoverScore);

                        //OnHover function call
                        var argCallback = $(bgDiv).data("argCallback");
                        configuration.onHover && configuration.onHover(hoverScore, argCallback);
                    },
                    click: function() {
                        //Get relevant objs
                        var $starDiv = $(this);
                        var $starContainer = $(starContainer);
                        var $bgDiv = $(bgDiv);

                        //Check if maximum rating as been made
                        if (_ratingRemainingClick($bgDiv) < 1) {
                            _removeRatingStarTitle($starContainer);
                            return;
                        }

                        _ratingUpdateClickCount($bgDiv, 1);

                        //Math
                        var clickScore = +$starDiv.attr("id");

                        //Update score if enabled
                        var score = +$bgDiv.data("score");
                        var count = +$bgDiv.data("count");
                        if (configuration.updateScore && (count >= 0)) {
                            score = ((score * count) + clickScore) / (count + 1), 2;
                            count++;
                            $bgDiv.data("score", score);
                            $bgDiv.data("count", count);

                            //Toop tip average
                            _addRatingAvgTp($bgDiv, score, count);

                            //Update display
                            onDiv.style.width = _getOnPercentage(score);
                            offDiv.style.width = _getOffPercentage(score);
                        }

                        //Change the cursor
                        $bgDiv.css('cursor', 'default');

                        //Change hover class
                        onDiv.className = configuration.onClass;
                        offDiv.className = configuration.offClass;

                        //Make data object for callback function
                        var argCallback = $bgDiv.data("argCallback");
                        configuration.onClick && configuration.onClick(clickScore, argCallback);
                    },
                }, "div");

                //Mouse enter & leave effect
                $(bgDiv).on({
                    mouseenter: function() {
                        //Get relevant objs
                        var bgDiv = $(this);
                        var onDiv = (bgDiv.children().get(0));
                        var offDiv = (bgDiv.children().get(1));
                        var starContainer = $(bgDiv.children().get(2));

                        //Check if maximum rating as been made
                        if (_ratingRemainingClick(bgDiv) < 1) {
                            _removeRatingStarTitle(starContainer);
                            return;
                        }

                        //Change hover class
                        onDiv.className = configuration.onClassHover;
                        offDiv.className = configuration.offClassHover;

                        //Change the cursor
                        bgDiv.css('cursor', 'pointer');
                    },
                    mouseleave: function() {
                        //Get relevant objs
                        var bgDiv = $(this);
                        var onDiv = (bgDiv.children().get(0));
                        var offDiv = (bgDiv.children().get(1));

                        //Change the cursor
                        bgDiv.css('cursor', 'default');

                        //Change hover class
                        onDiv.className = configuration.onClass;
                        offDiv.className = configuration.offClass;

                        //Maths
                        var hoverScore = bgDiv.data("score");
                        onDiv.style.width = _getOnPercentage(hoverScore);
                        offDiv.style.width = _getOffPercentage(hoverScore);
                    },
                });
            });
        }

        /**
         * _init()
         *
         * initialize lazy plugin
         * bind loading to events or set delay time to load all images at once
         *
         * @return void
         */
        function _init(){
            //Draw all starts with initial rating
            drawRatingStar();
        }
		
        /**
         * Adds toop tip to the input div
         */
        function _addRatingAvgTp($divElement, score, clickCount) {
            var str = "";

            //Add score first			
            if (configuration.tp_showAverage) {
                str += configuration.prefixAverage + score.toFixed(2);
            }

            //Add max score
            if (configuration.tp_showMaxScore) {
                if (str.length > 0)
                    str += "/";
                str += configuration.ratingCount;
            }

            //Add count
            if (configuration.tp_showCount) {
                if ((clickCount) && (clickCount > 0)) {
                    if (str.length > 0)
                        str += " ";
                    str += "(" + clickCount + ")";
                }
            }

            //Append to div
            $divElement && ($divElement.attr('title', str));
            return str;
        }
		
        /**
         * get on percentage
         */
        function _getOnPercentage(score) {
            return ((score / configuration.ratingCount) * 100) + per;
        }

        /**
         * get off percentage
         */
        function _getOffPercentage(score) {
            return (((configuration.ratingCount - score) / configuration.ratingCount) * 100) + per;
        }

        /**
         * Checks if number of clicks has maxed out or not
         * return: count remaining clicks
         */
        function _ratingRemainingClick(dataDiv) {
            //Read data from cookie
            var clickCount = +dataDiv.data('clickCount');
            if (configuration.cookieEnable) {
                var _cookie = +_readCookieRating(configuration.cookiePrefix + dataDiv.data('cookieIndex'));
                if (!!_cookie == false) {
                    _cookie = 0;
                }
                clickCount = (_cookie > clickCount) ? _cookie : clickCount;
            }

            //Check click count
            return (configuration.maxClick - clickCount);
        }

        /**
         Remove individual rating start title
         */
        function _removeRatingStarTitle(parentElement) {
            var starDiv = parentElement.children();
            var maxCount = starDiv.size();
            for (var i = 0; i < maxCount; i++) {
                $(starDiv.get(i)).removeAttr('title');
            }
        }

        /**
         * Checks if number of clicks has maxed out or not
         * return: void
         */
        function _ratingUpdateClickCount(dataDiv, incrementCount) {
            //Get click count
            var clickCount = +dataDiv.data('clickCount');
            if (configuration.cookieEnable) {
                var _cookie = +_readCookieRating(configuration.cookiePrefix + dataDiv.data('cookieIndex'));
                if (!!_cookie == false) {
                    _cookie = 0;
                }
                clickCount = (_cookie > clickCount) ? _cookie : clickCount;
            }

            //Update count in memory & cookie
            $(dataDiv).data('clickCount', clickCount + incrementCount);
            if (configuration.cookieEnable) {
                _eraseCookieRating(configuration.cookiePrefix + dataDiv.data('cookieIndex'));
                _createCookieRating(configuration.cookiePrefix + dataDiv.data('cookieIndex'), clickCount + incrementCount, configuration.cookieLifeDays);
            }
        }

        /**
         * Create cookie
         */
        function _createCookieRating(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else
                var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        /**
         * Read cookie
         */
        function _readCookieRating(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                    return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        /**
         * delete cookie
         */
        function _eraseCookieRating(name) {
            _createCookieRating(name, "", -1);
        }
        
        return this;
    };

    // make lazy a bit more case-insensitive :)
    $.fn.WebRating = $.fn.webRating;

})(jQuery, window, document);
