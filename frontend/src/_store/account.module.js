import { userService } from '../_services';
import { router } from '../_helpers';

const login = localStorage.getItem('login');
const state = login
    ? { status: { loggedIn: true }, login: 'AWS' }
    : { status: {}, login: null };

const actions = {
    login({ dispatch, commit }, { username, password }) {
        commit('loginRequest', { username });
        userService.login(username, password)
            .then(
                data => {
                    commit('loginSuccess', data);
                    router.push('/');
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    logout({ commit }) {
        userService.logout();
        commit('logout');
    },
    register({ dispatch, commit }, user) {
        commit('registerRequest', user);
        userService.register(user)
            .then(
                data => {
                    commit('registerSuccess', user);
                    router.push('/welcome');
                },
                error => {
                    commit('registerFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    checkin({ dispatch, commit }, guestImage) {
        commit('checkinRequest', guestImage);
        userService.checkin(guestImage)
            .then(
                guest => {
                    commit('checkinSuccess', guest);
                },
                error => {
                    commit('checkinFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    }
};

const mutations = {
    loginRequest(state, username) {
        state.status = { loggingIn: true };
    },
    loginSuccess(state, data) {
        state.status = { loggedIn: true };
        state.login = 'AWS';
    },
    loginFailure(state) {
        state.status = {};
    },
    logout(state) {
        state.status = {};
        state.user = null;
    },
    registerRequest(state, user) {
        state.status = { registering: true };
    },
    registerSuccess(state, user) {
        state.status = {};
        state.user = user;
        console.log('Called');
        console.log(state.user);
    },
    registerFailure(state, error) {
        state.status = {};
    },
    checkinRequest(state, guest) {
        state.status = { checking: true};
    },
    checkinSuccess(state, guest) {
        state.status = {};
        state.guest = guest;
    },
    checkinFailure(state, error) {
        state.status = {};
    },
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};