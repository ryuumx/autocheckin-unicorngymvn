<template>
    <div>
        <div style="background: url(images/background.jpg); box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .5);">
            <div class="login100-form-title">
                <span class="login100-form-title-1">
	    	        Thank you for registering for
	    	    </span>
                <span class="login100-form-title-1">
                    2020 Unicorn Gym Viet Nam 
                </span>
            </div>
        </div>
        <div style="width:80%; display:block; margin-left: auto; margin-right: auto; text-align: center; margin-top:20px">
            <div v-if="user && user.firstname">
                <h2 style="margin-bottom:10px">Your information is as below:</h2>
                <h4>First Name: {{ user.firstname }}</h4>
                <h4>Last Name: {{ user.lastname }}</h4>
                <h4>Email Address: {{ user.email }}</h4>
                <h4 v-if="user.company && user.company != '' ">Company: {{ user.company }}</h4>
            </div>
            <div style="margin-top:20px">
                <h3>Looking forward to seeing you!</h3>
            </div>
            <div class="form-group" style="margin-top:50px">
                <router-link to="/register" class="btn btn-link">Back to Register</router-link>
            </div>
            
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    computed: {
        ...mapState('account', ['user'])
    },
};
</script>