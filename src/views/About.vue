<template>
    <h1>Version 1.0.0</h1>
    <router-link to="/menu">Go Back</router-link>
    <h2>{{title}}</h2>
    <Rest :restaurant="restaurant" />
</template>

<script>
import Rest from '../components/Rest'
export default {
    name: 'About',
    components:{
        Rest
    },
    data(){
        return{
            title: '',
            restaurant: []
        }
    },
    async created(){
        const token = JSON.parse(localStorage.getItem('token'))
        this.title = JSON.parse(localStorage.getItem('name'))
        let id = JSON.parse(localStorage.getItem('id'))
        const res = await fetch(`api/restaurant/${id}`,{headers: {'Content-type': 'application/json', 'Authorization': ' Bearer ' + token}})
        this.restaurant = await res.json()
    },
    emits:['change-mode']
}
</script>