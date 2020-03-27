<template>
    <div>
        <div style="background: url(images/background.jpg); box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .5);">
            <div class="login100-form-title">
                <span class="login100-form-title-1">
	    	        Welcome to the
	    	    </span>
                <span class="login100-form-title-1">
                    2020 Unicorn Gym Viet Nam
                </span>
            </div>
        </div>
        <div style="width:80%; display:block; margin-left: auto; margin-right: auto; text-align: center; margin-top:20px">
            <div>
                <h2 style="margin-bottom:10px">Let's check you in</h2>
                <div><video ref="video" id="video" style="width:100%; height:auto; max-width:600px" autoplay></video></div>
                <div><button type="button" class="btn btn-primary" :disabled="status.checking" id="snap" v-on:click="capture()">Smile!</button></div>
                <img v-show="status.checking" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                <canvas ref="canvas" id="canvas" width="300" height="200"></canvas>
            </div>
            <div v-if="this.$store.state.account.guest" style="margin-top:20px">
                <h3>Welcome {{ this.$store.state.account.guest.firstname }} {{ this.$store.state.account.guest.lastname }}!</h3>
                <h5 style="margin-top:5px">(We're {{ this.$store.state.account.guest.percentage }}% sure it's you)</h5>
                <h4 style="margin-top:10px">Your seat number is 12A. Our Account Manager will see you shortly.</h4>
            </div>
            <div style="margin-top:50px">
                <h5>Enjoy your experience? Leave us feedbacks here  <span><img src="images/aws.gif" /></span></h5>
            </div>
            <div style="margin-top:50px">
                <router-link to="/login" class="btn btn-link">Logout</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data () {
        return {
            guestImage: {
                image: '',
            }
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
        ...mapState('account', ['status', 'guest'])
    },
    methods: {
        ...mapActions('account', ['checkin']),
        capture() {
            this.canvas = this.$refs.canvas;
            var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 300, 200);
            this.guestImage.image = canvas.toDataURL("image/png");
            this.checkin(this.guestImage);
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
</style>