<template>
    <header>
        <div class="logo"><img src="/api/images/101/favicon.ico"><h1>{{ title }} </h1></div>
        <div class="nav">
        <Button 
            @click="$router.push('menu')"
            :text="'Menu' " 
            :color="'linear-gradient(to right, #484a4e, #757472)' "/>
        <Button @click="$router.push('order')" :text=" 'Orders' "  :color= "'linear-gradient(to right, #757472, #9c7777)'" />
        <router-link to='/'>
            <Button :text=" 'Logout'"  :color="'linear-gradient(to right, #a33e3e, #e95f5f)'"/>
        </router-link>
        </div>
    </header>
</template>

<script>
import Button from './Button'

export default {
    name: 'Header',   
    props: {
        title: String,
    },
    components:{
        Button
    }
}
</script>

<style scoped>
header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #2c3e50;
    background-color: #e4dfd8;
    border-radius: 0.5em;
    margin-bottom: 0.6em;
}

.logo{
    display: flex;
}

h1,img{
    align-self: center;
    margin-left: 1em;
}

.nav{
    text-align: right;
    margin-right: 1em;
}

</style>
