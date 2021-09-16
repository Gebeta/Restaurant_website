<template class="ff">
  <router-view @change-mode="changeMode"></router-view>
  <Footer :smode="smode"/>
</template>

<script>
import Footer from './components/Footer'

export default {
  name: 'App',
  data(){
    return{
      smode: '#333'
    }
  },
  components: {
    Footer,
  },
  methods:{
    changeMode(start){
      var mode = JSON.parse(localStorage.getItem('mode'))
      if(start){
        var select = document.getElementById("mode");
        if(mode){
            select.options[0].selected = true;
        }else{select.options[1].selected = true;}
      } else {
        var body = document.querySelector('body');
        var app = document.getElementById('app');
        if(mode){
          body.style.backgroundColor = 'rgb(228, 223, 216)'
          app.style.backgroundColor = 'rgb(238, 236, 233)'
          this.smode = '#333'
        }else{
          body.style.backgroundColor = '#171616'
          app.style.backgroundColor = '#252222'
          app.style.border = 'none'
          this.smode = '#fff'
        }
      }
    }
  },
  created(){
    this.changeMode()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 10px 30px;
  margin: 2em;
  background: rgb(238, 236, 233);
  user-select: none;
  overflow-x: auto;
  border-radius: 1%;
}

body{
  background: rgb(228, 223, 216);
}
</style>
