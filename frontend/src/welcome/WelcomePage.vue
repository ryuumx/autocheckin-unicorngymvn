<template>
    <div class="container-login100">
        <div class="wrap-login100">
            <div style="background: url(images/background.jpg); box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .3);">
                <div class="login100-form-title">
                    <span class="login100-form-title-1">Registration succeeded</span>
                </div>
            </div>
            <div class="col-12 col-lg-10 offset-lg-1 m-t-20 welcome-display" v-if="user && user.firstname">
                <h2 class="m-b-30">Thank you for registering to the <span>{{ eventName }}</span></h2>
                <h3 class="m-b-10">Your information is as below:</h3>
                <div>
                    <div class="row">
                        <div class="col-6" style="text-align:right">First Name:</div>
                        <div class="col-6" style="text-align:left">{{ user.firstname }}</div>
                    </div>
                    <div class="row">
                        <div class="col-6" style="text-align:right">Last Name:</div>
                        <div class="col-6" style="text-align:left">{{ user.lastname }}</div>
                    </div>
                    <div class="row">
                        <div class="col-6" style="text-align:right">Email Address:</div>
                        <div class="col-6" style="text-align:left">{{ user.email }}</div>
                    </div>
                    <div v-if="user.company && user.company != '' " class="row">
                        <div class="col-6" style="text-align:right">Compant:</div>
                        <div class="col-6" style="text-align:left">{{ user.company }}</div>
                    </div>
                </div>
                <div class="m-t-20">
                    <h4>You will receive a confirmation email shortly.</h4>
                    <h4>Looking forward to seeing you!</h4>
                </div>
                <div class="m-t-30">
                    <router-link to="/register" class="btn btn-link">Back to Register</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    computed: {
        ...mapState('account', ['user']),
        eventName() {
            return this.$store.state.alert.eventName;
        }
    },
};
</script>