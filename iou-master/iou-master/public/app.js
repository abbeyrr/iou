/** Redirects to `path`. */
function redirect(path) {
    router.push(path);
}

/**
 * Checks if the user is logged in.
 * 
 * Returns `true` if the user has a valid `refreshToken`.
 */
function loggedIn() {
    if (window.localStorage.getItem('refreshToken') != null) {
        return refreshAuth()
            .then(() => { return true; })
            .catch(() => { return false; });
    } else {
        return false;
    }
}

/** Reauthenticates the user with their `refreshToken`. */
function refreshAuth() {
    // Attempt to reauthenticate with refresh token
    return api('/api/auth/refresh', 'POST', false, {
        refreshToken: window.localStorage.getItem('refreshToken')
    }).then(res => {
        if (res.status == 200) { // If successful set new token and solve the promise
            return res.json().then(data => {
                window.localStorage.setItem('token', data.token);
                window.localStorage.setItem('refreshToken', data.refreshToken);
                return new Promise(resolve => resolve());
            });
        } else { // Reauthentication failed
            // Remove all tokens
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('refreshToken');
            return new Promise((resolve, reject) => reject()); // Reject the promise
        }
    });
}

/** Helper function to make JSON API calls. */
function api(path, method, auth, body) {
    let headers = {
        'Accept': 'application/json', // Expecting JSON back
        'Content-Type': 'application/json', // Sending JSON
    };
    // If needs auth add the auth header with the token
    if (auth) {
        let token = window.localStorage.getItem('token');
        headers['Authorization'] = `Bearer ${token}`;
    }
    // Make request
    return fetch(`${window.location.origin}${path}`, {
        method: method,
        headers: headers,
        body: (body == null) ? null : JSON.stringify(body), // If body is null then don't stringify it
    }).then(res => {
        // If auth was needed and the status was forbidden
        if (auth && res.status == 403) {
            // Attempt to reauthenticate
            return refreshAuth().then(() => {
                return api(path, method, auth, body); // Remake request
            }).catch(() => {
                redirect('/'); // Redirect to homepage
                return new Promise((resolve, reject) => reject()); // Rejects the promise
            });
        }
        // Return successful promise with response
        return new Promise(resolve => resolve(res));
    });
}

const router = new VueRouter({
    routes: [
        {
            path: '/dashboard',
            component: httpVueLoader('/Dashboard.vue')
        },
        {
            path: '/register',
            component: httpVueLoader('/Register.vue')
        },
        {
            path: '/',
            component: httpVueLoader('/Homepage.vue')
        },
        {
            // Default route must be last
            path: '*',
            redirect: '/'
        }
    ],
    mode: 'history',
    base: '/'
});

// Register global functions
// (applies to every component)
Vue.mixin({
    methods: {
        applyTheme() {
            const res = localStorage.getItem("dark_theme") === "true";
            this.$vuetify.theme.dark = res;
            return res;
        }
    }
});

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: theme,
    }),
    router: router
});