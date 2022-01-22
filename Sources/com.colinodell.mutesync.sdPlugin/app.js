/* global $CC, Utils, $SD */

const mutesync = ThrottledMutesyncAPI();
var refreshInterval = null;

/**
 * The 'connected' event is sent to your plugin, after the plugin's instance
 * is registered with Stream Deck software. It carries the current websocket
 * and other information about the current environmet in a JSON object
 * You can use it to subscribe to events you want to use in your plugin.
 */

$SD.on('connected', (jsonObj) => connected(jsonObj));

function connected(jsn) {
    // Subscribe to the willAppear and other events
    $SD.on('com.colinodell.mutesync.action.willAppear', (jsonObj) => action.onWillAppear(jsonObj));
    $SD.on('com.colinodell.mutesync.action.willDisappear', (jsonObj) => action.onWillDisappear(jsonObj));
    $SD.on('com.colinodell.mutesync.action.keyUp', (jsonObj) => action.onKeyUp(jsonObj));
    $SD.on('com.colinodell.mutesync.action.didReceiveGlobalSettings', (jsonObj) => action.onDidReceiveGlobalSettings(jsonObj));

    mutesync.onTokenChanged((token) => {
        $SD.api.setGlobalSettings(jsn.context, {token: token});
    });
}

let images = {
    no_meeting: null,
    muted: null,
    unmuted: null,
}

Utils.loadImage('images/unmuted@2x.png', (i) => images.no_meeting = i, true, "#444444")
Utils.loadImage('images/muted@2x.png', (i) => images.muted = i, true, "#ca2020")
Utils.loadImage('images/unmuted@2x.png', (i) => images.unmuted = i, true, "#34ca20")

// ACTIONS

const action = {
    restoreTokenFromSettings: (jsn) => {
        const token = Utils.getProp(jsn, 'payload.settings.token', null);
        mutesync.restoreToken(token);
    },
    onDidReceiveGlobalSettings: (jsn) => {
        this.restoreTokenFromSettings(jsn);
    },

    onWillAppear: function (jsn) {
        this.restoreTokenFromSettings(jsn);

        if (refreshInterval !== null) {
            clearInterval(refreshInterval);
        }

        refreshInterval = setInterval(() => {
            mutesync.getState().then((status) => {
                this.updateState(jsn, status);
            }).catch((err) => {
                this.onError(jsn, err);
            });
        }, 500); // every 500ms
    },

    onWillDisappear: function (jsn) {
        if (refreshInterval !== null) {
            clearInterval(refreshInterval);
        }
    },

    onKeyUp: function (jsn) {
        mutesync.toggle().then((status) => {
            this.updateState(jsn, status);
        }).catch((err) => {
            this.onError(jsn, err);
        });
    },

    onError: function (jsn, err) {
        console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[app.js]onError:');
        console.log(err);
        $SD.api.setTitle(jsn.context, 'Error!');
    },

    updateState: function (jsn, status) {
        // const states = ['unmuted', 'muted'];

        if (!status.in_meeting) {
            $SD.api.setState(jsn.context, 0);
            $SD.api.setTitle(jsn.context, 'No meeting');
            $SD.api.setImage(jsn.context, images.no_meeting)
            return;
        }

        if (status.muted) {
            $SD.api.setState(jsn.context, 1);
            $SD.api.setTitle(jsn.context, 'Muted');
            $SD.api.setImage(jsn.context, images.muted);
        } else {
            $SD.api.setState(jsn.context, 0);
            $SD.api.setTitle(jsn.context, 'Unmuted');
            $SD.api.setImage(jsn.context, images.unmuted);
        }
    },
};

