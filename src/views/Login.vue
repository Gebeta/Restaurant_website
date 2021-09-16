<template>
  <div class="idiv"><img alt="logo" src="../assets/logo.png"></div>
  <div class="container">
      <img src="../assets/login.png" />
      <form @submit.prevent="login">
          <div class="mb-3">
              <input type="email" v-model="email" placeholder="Email">
          </div>
          <div class="mb-3">     
              <input type="password" v-model="password" placeholder="Enter Password">
          </div>    
          <button type="submit">Login</button>
          <div class="mb-3"><br/>
              <label>Don't have account <router-link to='/register'>Register here</router-link></label>
          </div>
      </form>
  </div>
  <NotificationList :notifications="notifications" @remove-notification="removeNotification"/>
</template>

<script>
import '@/assets/styles/style.css';
import store from '../store'
import NotificationList from '../components/NotificationList'

export default {
  name: 'Login',
  data(){
    return{
      email:'',
      password:'',
      notifications: []
    }
  },
  components:{
    NotificationList
  },
  methods:{
        async login(){
          const obj = { email:this.email, password:this.password};
          const res = await fetch('api/auth/login', {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(obj)
          })

          const data = await res.json()
          if(res.status === 200){
                store.commit('setToken', arguments[1] = data.token)
                store.commit('setId', arguments[1] = data._id)
                store.commit('setName', arguments[1] = data.name)
                this.$router.push('menu')
            }else{
                this.addNotification({id: 1001, message: data.message,type: 'dismissible'})
          }
        },
        addNotification(notif){
          let show = true;
          this.notifications.forEach((n) => {if(n.id == notif.id){show = false}})
          if(show){this.notifications.push(notif)}
        },
        removeNotification(id){
            this.notifications = this.notifications.filter((notif) => notif.id !== id)
        }
    },
    emits:['change-mode']
}
</script>

<style scoped>
</style>
