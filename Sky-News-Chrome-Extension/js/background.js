var background = {
    parseTwitter: function(twitter) {
        //get feed
        //get the first item in the json and check to see if it's in the db
        //if it is do nothing
        //else display popup
        var lastTweetId = twitter[0].id_str
        var lastTweetInDb = this.getItem('lastTweet');
        if (lastTweetInDb != lastTweetId) {
            this.setItem('lastTweet', lastTweetId);
            this.popupNotification();
        } else {
            console.log('lastTweet was not found', lastTweetInDb, lastTweetId);
        }
    },

    popupNotification: function() {
        var pinnedPopup = window.webkitNotifications.createHTMLNotification(chrome.extension.getURL('twitterPopup.html'));
        pinnedPopup.ondisplay = function() {
            pinnedPopupOpen = true;
        };
        pinnedPopup.onclose = function() {
            pinnedPopupOpen = false;
        };
        pinnedPopup.show();
    },

    //Clears all the key value pairs in the local storage
    clearStrg: function() {
        log('about to clear local storage');
        window.localStorage.clear();
        log('cleared');
    },

    //sets the item in the localstorage
    setItem: function(key, value) {
        try {
            log("Inside setItem:" + key + ":" + value);
            window.localStorage.removeItem(key);
            window.localStorage.setItem(key, value);
        } catch(e) {
            log("Error inside setItem");
            log(e);
        }
        log("Return from setItem" + key + ":" + value);
    },

    //Gets the item from local storage with the specified
    //key
    getItem: function(key) {
        var value;
        try {
            value = window.localStorage.getItem(key);
        } catch(e) {
            value = "null";
        }
        return value;
    },
    //Clears all the key value pairs in the local storage
    clearStrg: function() {
        window.localStorage.clear();
    },

    show: function() {
        var enabled = window.localStorage.getItem('isTwitterEnabled');
		var self = this;
        if (enabled === 'true') {
            $.ajax({
                type: "GET",
                // url: "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=SkyNewsBreak",
                url: "demo/testData.json",
                dataType: "json",
                success: self.parseTwitter
            });
        }
    }
}