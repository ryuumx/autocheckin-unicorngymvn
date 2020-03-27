<template>
    <div class="limiter">
	    <div class="container-login100">
	        <div class="wrap-login100">
                <div class="login100-form-title" style="background-image: url(images/background.jpg);">
		    		<span class="login100-form-title-1">
		    			Login
		    		</span>
		    	</div>
                <form class="login100-form" @submit.prevent="handleSubmit">
                    <div class="wrap-input100 m-b-26">
                        <span class="label-input100" for="username">Username</span>
                        <input class="input100" type="text" v-model="username" name="username" :class="{ 'is-invalid': submitted && !username }" />
                        <div v-show="submitted && !username" class="focus-input100">Username is required</div>
                    </div>
                    <div class="wrap-input100 m-b-18">
                        <span class="label-input100" htmlFor="password">Password</span>
                        <input type="password" v-model="password" name="password" class="input100" :class="{ 'is-invalid': submitted && !password }" />
                        <div v-show="submitted && !password" class="focus-input100">Password is required</div>
                    </div>
                    <div class="form-group" style="margin-top:50px">
                        <button class="btn btn-primary" :disabled="status.loggingIn">Login</button>
                        <img v-show="status.loggingIn" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        <router-link to="/register" class="btn btn-link">To Register Portal</router-link>
                    </div>
                </form>
		    </div>
		</div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data () {
        return {
            username: '',
            password: '',
            submitted: false
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    created () {
        this.logout();
    },
    methods: {
        ...mapActions('account', ['login', 'logout']),
        handleSubmit (e) {
            this.submitted = true;
            const { username, password } = this;
            if (username && password) {
                this.login({ username, password });
            }
        }
    }
};
</script>