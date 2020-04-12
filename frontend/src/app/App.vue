<template>
    <div class="jumbotron">
        <div class="col-sm-12 col-sx-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
            <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
        </div>
        <div class="col-sm-12 col-sx-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
            <router-view></router-view>
        </div>
        <footer>
            <p class="copyright">© AMAZON WEB SERVICES 2020</p>
        </footer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'app',
    computed: {
        ...mapState({
            alert: state => state.alert
        })
    },
    methods: {
        ...mapActions({
            clearAlert: 'alert/clear' 
        })
    },
    watch: {
        $route (to, from){
            // clear alert on location change
            this.clearAlert();
        }
    } 
};
</script>