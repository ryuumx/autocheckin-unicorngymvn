<template>
    <div class="container-login100">
        <div class="wrap-login100">
            <div style="background: url(images/background.jpg); box-shadow: inset 0px 0px 400px 110px rgba(0, 0, 0, .3);">
                <div class="login100-form-title">
                    <span class="login100-form-title-1">Welcome to the</span>
                    <span class="login100-form-title-1">{{ eventName }}</span>
                </div>
            </div>
            <div class="col-12 col-lg-10 offset-lg-1 m-t-20 welcome-display">
                <div v-show="!this.$store.state.account.guest">
                    <h2 class="m-b-10">Let's check you in</h2>
                    <div><video ref="video" id="video" style="width:100%; height:auto;" autoplay></video></div>
                    <div align="center">
                        <button type="button" class="login100-form-btn" :disabled="status.checking" id="snap" v-on:click="capture()">Snap Photo</button>
                        <img v-show="status.loggingIn" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    </div>
                    <canvas ref="canvas" id="canvas" width="300" height="200"></canvas>
                </div>
                <div v-if="this.$store.state.account.guest" class="m-t-20">
                    <h2>You're all set, {{ this.$store.state.account.guest.firstname }} {{ this.$store.state.account.guest.lastname }}!</h2>
                    <h5 class="m-t-5">(We're {{ this.$store.state.account.guest.percentage }}% sure it's you)</h5>
                    <h4 class="m-t-10">Your seat number is <span style="font-weight:bold;">12R5</span>.</h4>
                    <img class="m-t-10 map-image" src="images/map.gif" />
                    <div align="center" class="m-t-20">
                        <button type="button" class="login100-form-btn" v-on:click="back()">Got It</button>
                    </div>
                </div>
                <div class="m-t-30">
                    <h6>Enjoy your experience? Leave us feedbacks here  <span><img src="images/aws.gif" style="width:25px;height:25px" /></span></h6>
                </div>
                <div class="m-t-30">
                    <router-link to="/login" class="btn btn-link">Logout</router-link>
                </div>
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
        ...mapState('account', ['status', 'guest']),
        eventName() {
            return this.$store.state.alert.eventName;
        }
    },
    methods: {
        ...mapActions('account', ['checkin', 'reset']),
        capture() {
            this.canvas = this.$refs.canvas;
            var context = this.canvas.getContext("2d").drawImage(this.video, 0, 0, 300, 200);
            this.guestImage.image = canvas.toDataURL("image/png");
            this.checkin(this.guestImage);
        },
        back() {
            this.reset();
            this.$forceUpdate();
        }
    }
};
</script>