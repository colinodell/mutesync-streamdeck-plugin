const MutesyncAPI = function () {
    let token = null;
    let onTokenChanged = () => {};

    const request = (method, url, token) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, 'http://localhost:8249' + url);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('x-mutesync-api-version', '1');
            if (token) {
                xhr.setRequestHeader('Authorization', 'Token ' + token);
            }
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject([xhr.status, xhr.statusText]);
                }
            };
            xhr.onerror = () => reject([xhr.status, xhr.statusText]);
            xhr.send();
        });
    };

    const getToken = () => {
        if (token !== null) {
            return Promise.resolve(token);
        }

        return request('GET', '/authenticate').then(response => {
            token = response.token;
            onTokenChanged(token);
            return token;
        })
    };

    const requestWithToken = (method, url) => {
        return getToken()
            .then(token => request(method, url, token))
            .then(res => res.data)
            .catch(([status, statusText]) => {
                if (status === 403) {
                    token = null;
                    onTokenChanged(token);
                }

                return Promise.reject([status, statusText]);
            });
    };

    return {
        getState: () => requestWithToken('GET', '/state'),
        toggle: () => requestWithToken('POST', '/toggle-mute'),

        onTokenChanged: (callback) => {
            onTokenChanged = callback;
        },

        restoreToken: (t) => {
            token = t;
        }
    }
};

const ThrottledMutesyncAPI = function () {
    const api = MutesyncAPI();
    const rate = 500;

    let lastState = null;
    let lastStateTime = 0;

    return {
        getState: () => {
            if (Date.now() - lastStateTime <= rate) {
                return Promise.resolve(lastState);
            }

            return api.getState().then(state => {
                if (Date.now() - lastStateTime <= rate) {
                    return lastState;
                }

                lastState = state;
                lastStateTime = Date.now();
                return state;
            });
        },

        toggle: () => {
            // The post-toggle state should take priority over any in-flight getState() calls
            lastStateTime = Date.now();

            return api.toggle().then(state => {
                lastState = state;
                lastStateTime = Date.now();
                return state;
            })
        },

        onTokenChanged: api.onTokenChanged,
        restoreToken: api.restoreToken
    }
};