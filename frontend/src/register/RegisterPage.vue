<template>
    <div class="limiter">
	    <div class="container-login100">
	        <div class="wrap-login100">
                <div class="login100-form-title" style="background-image: url(images/background.jpg);">
		    		<span class="login100-form-title-1">
		    			Register
		    		</span>
		    	</div>
                <form class="form-group" @submit.prevent="handleSubmit">
                    <div class="login100-form" style="padding-bottom:30px;">
                        <div class="wrap-input100 m-b-26">
                            <span class="label-input100" for="firstname">First Name</span>
                            <input type="text" v-model="user.firstname" v-validate="'required'" name="firstname" class="input100" :class="{ 'is-invalid': submitted && errors.has('firstname') }" />
                            <div v-show="submitted && errors.has('firstname')" class="focus-input100">{{ errors.first('firstname') }}</div>
                        </div>
                        <div class="wrap-input100 m-b-26">
                            <span class="label-input100" for="lastname">Last Name</span>
                            <input type="text" v-model="user.lastname" v-validate="'required'" name="lastname" class="input100" :class="{ 'is-invalid': submitted && errors.has('lastname') }" />
                            <div v-show="submitted && errors.has('lastname')" class="focus-input100">{{ errors.first('lastname') }}</div>
                        </div>
                        <div class="wrap-input100 m-b-26">
                            <span class="label-input100" for="email">Email</span>
                            <input type="text" v-model="user.email" v-validate="'required'" name="email" class="input100" :class="{ 'is-invalid': submitted && errors.has('email') }" />
                            <div v-show="submitted && errors.has('email')" class="focus-input100">{{ errors.first('email') }}</div>
                        </div>
                        <div class="wrap-input100 m-b-26">
                            <span class="label-input100" for="company">Company</span>
                            <input type="text" v-model="user.company" v-validate="'required'" name="company" class="input100" :class="{ 'is-invalid': submitted && errors.has('company') }" />
                            <div v-show="submitted && errors.has('company')" class="focus-input100">{{ errors.first('company') }}</div>
                        </div>
                    </div>
                    <div class="form-group" style="width:90%; display:block; margin-left: auto; margin-right: auto;">
                        <div style="margin-bottom:10px;"><button type="button" class="btn btn-warning" :disabled="status.registering" id="snap" v-on:click="capture()">Snap Photo</button></div>
                        <div><video ref="video" id="video" width="100%" height="auto" autoplay></video></div>
                        <canvas ref="canvas" id="canvas" width="300" height="200"></canvas>
                        <ul>
                            <li v-for="c in user.images">
                                <img v-bind:src="c" height="50" />
                            </li>
                        </ul>
                    </div>
                    <div class="login100-form" style="padding-top:20px;padding-bottom:50px">
                        <div class="form-group" style="margin-top:20px">
                            <button class="btn btn-primary" :disabled="status.registering">Register</button>
                            <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        </div>
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
            user: {
                firstname: '',
                lastname: '',
                email: '',
                company: '',
                images: []
            },
            submitted: false
        }
    },
    mounted() {
        this.video = this.$refs.video;
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                this.video.srcObject = stream;
                this.video.play();
            });
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    methods: {
        ...mapActions('account', ['register']),
        handleSubmit(e) {
            this.submitted = true;
            this.$validator.validate().then(valid => {
                if (valid) {
                    this.register(this.user);
                }
            });
        },
        capture() {
            if (this.user.images.length > 4) {
                alert("Maximum pictures reached!");
            } else {
                this.canvas = this.$refs.canvas;
                var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 300, 200);
                this.user.images.push(canvas.toDataURL("image/png"));
            }
        }
    }
};
</script>

<style>
    #video {
        background-color: #000000;
    }
    #canvas {
        display: none;
    }
    ul {
        margin-top: 5px;
    }
    li {
        display: inline;
        padding: 5px;
    }
</style>
