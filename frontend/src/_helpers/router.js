import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '../home/HomePage'
import LoginPage from '../login/LoginPage'
import RegisterPage from '../register/RegisterPage'
import WelcomePage from '../welcome/WelcomePage'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/welcome', component: WelcomePage },

    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register', '/welcome'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('login');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})