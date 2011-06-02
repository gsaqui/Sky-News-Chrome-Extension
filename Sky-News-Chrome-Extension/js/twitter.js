; (function($) {
    // secure $ jQuery alias
    $.fn.twitter = function(options) {
        function parseTwitter(twitter) {
            console.log('hi');
            var $tmpl = $('#template');
            // console.log('date is ', twitter[0].created_at, this.timeAgo(twitter[0].created_at))
            // add twitter links
            $('#news-items').jqoteapp($tmpl, {
                tweet: twitter[0].text,
                time: timeAgo(twitter[0].created_at)
            });
            close();
        }

        function close() {
            //http://code.google.com/chrome/extensions/messaging.html
            /*            chrome.extension.sendRequest({tweetTime: "hello", }, function(response) {
                console.log(response.farewell);
            }); */
            //window.close();
            var port = chrome.extension.connect({
                name: "twitterNotification"
            });
            port.postMessage({
                registerEvent: "registerEvent"
            });


            //waits for response
            port.onMessage.addListener(function(msg) {
                console.log('msg coming back is ', msg);
                if (msg.action == "close") {
                    window.close();
                }
            });


        }

        function show() {
            console.log('twitter popup - inside of show');
            $.ajax({
                type: "GET",
                url: globals.url,
                dataType: "json",
                success: parseTwitter,
                error: function(e) {
                    console.log('Error is', e);
                }
            });
        }

        /**
              *  This was taken from the twitter website - I didn't write it
	      * relative time calculator
	      * @param {string} twitter date string returned from Twitter API
	      * @return {string} relative time like "2 minutes ago"
	      */
        function timeAgo(dateString) {
            var rightNow = new Date();
            var then = new Date(dateString);

            var diff = rightNow - then;

            var second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

            if (isNaN(diff) || diff < 0) {
                return "";
                // return blank string if unknown
            }

            if (diff < second * 2) {
                // within 2 seconds
                return "right now";
            }

            if (diff < minute) {
                return Math.floor(diff / second) + " seconds ago";
            }

            if (diff < minute * 2) {
                return "about 1 minute ago";
            }

            if (diff < hour) {
                return Math.floor(diff / minute) + " minutes ago";
            }

            if (diff < hour * 2) {
                return "about 1 hour ago";
            }

            if (diff < day) {
                return Math.floor(diff / hour) + " hours ago";
            }

            if (diff > day && diff < day * 2) {
                return "yesterday";
            }

            if (diff < day * 365) {
                return Math.floor(diff / day) + " days ago";
            }

            else {
                return "over a year ago";
            }

        };

        show();

    };
    //end of twitter
})(jQuery);
// confine scope
