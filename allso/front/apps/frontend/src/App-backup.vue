<template>
  <v-app>
    <v-main>
      <fa-app-bar :title="title"/>
      <Header/>
      <router-view/>
      <Move/>
      <Footer/>
    </v-main>
  </v-app>
</template>

<script>
import FaAppBar from '@/components/commons/FaAppBar.vue'
import Footer from './components/commons/Footer.vue';
import Header from './components/commons/Header.vue';
import Move from './components/commons/Move.vue';

export default {
  components: { 
    FaAppBar,
    Header,
    Move,
    Footer
  },
  
  name: 'App',

  data: () => ({
     drawer: null
  }),

  computed: {
    title() {
      if(this.$route.path === '/') return 'Dashboard'
      if(this.$route.path === '/login') return 'Login'
      if(this.$route.path === '/admin-console') return 'Admin Console'
      if(this.$route.path === '/pbs-monitoring') return 'PBS Monitoring'
      if(this.$route.path === '/remote-control') return 'Remote Control'
      if(this.$route.path === '/report') return 'Report'
      if(this.$route.path === '/fru') return 'FRU'
      if(this.$route.path === '/alarm') return 'Alarm'
      return ''
    }
  }
};
</script>

<style lang="scss">

html,body{
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%
}

#app {
  background-color:#CFD8DC;
  height: 100%;
  width: 100%;
}

html{
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

html::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}

section{
  position: relative;
  height: 100%;
  padding-bottom: 100px;
}

@media (min-width: 1264px) {
  .container {
    max-width: 1600px;
  }
}

</style>