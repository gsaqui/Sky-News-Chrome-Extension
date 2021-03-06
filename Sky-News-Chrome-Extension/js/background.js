var background = {
    listOfListeners: [],
    eventsHaveBeenRegistered: 0,

    parseTwitter: function(twitter) {

        var lastTweetId = twitter[0].id_str
        var lastTweetInDb = background.getItem('lastTweet');
        if (lastTweetInDb != lastTweetId) {
            background.setItem('lastTweet', lastTweetId);
            background.popupNotification();
        } else {
            //console.log('lastTweet was not found', lastTweetInDb, lastTweetId);
            }
    },

    popupNotification: function() {
        this.closeOldestNotification();
        var pinnedPopup = window.webkitNotifications.createHTMLNotification(chrome.extension.getURL('twitterPopup.html'));

        pinnedPopup.ondisplay = function() {
            pinnedPopupOpen = true;
        };
        pinnedPopup.onclose = function() {
            pinnedPopupOpen = false;
        };

        pinnedPopup.show();
    },

    registerWindowListener: function() {
        if (this.eventsHaveBeenRegistered > 0) return;

        this.eventsHaveBeenRegistered = this.eventsHaveBeenRegistered + 1;
        //General listener
        chrome.extension.onConnect.addListener(function(port) {
            background.listOfListeners.push(port);
            port.onDisconnect.addListener(function(port) {
                var portToRemoveIndex = -1
                $.each(background.listOfListeners, function(index, value){
                    if(value.id == port.id){
                        portToRemoveIndex = index;
                        return false;
                    }
                });
                if(portToRemoveIndex >=0){
                    background.listOfListeners.splice(portToRemoveIndex,1);
                }
            });            
        });
    },

    closeOldestNotification: function() {
        if (this.listOfListeners.length >= 3) {
            var elementsToRemove = this.listOfListeners.splice(0, this.listOfListeners.length - 2);

            $.each(elementsToRemove, function(index, value) {
                try {
                    value.postMessage({
                        action: 'close'
                    });
                } catch(e){}

            });
        }
    },

    //Clears all the key value pairs in the local storage
    clearStrg: function() {
        window.localStorage.clear();
    },

    //sets the item in the localstorage
    setItem: function(key, value) {
        try {
            window.localStorage.removeItem(key);
            window.localStorage.setItem(key, value);
        } catch(e) {
            console.log(e);
        }
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
        this.registerWindowListener();
        var self = this;
        if (enabled === 'true') {
            $.ajax({
                type: "GET",

                url: globals.url,
                dataType: "json",
                success: self.parseTwitter,
                error: function(e){
                    console.log('error attempting to contact twitter', e);
                }
            });
        }
    }
}
