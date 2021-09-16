<template>
    <footer :style="{color:smode}">
        <p>Copyright &copy; 2021</p>
        <router-link to="/about">About</router-link>
    </footer>
</template>

<script>
export default {
    props:{
        smode: String
    }
}
</script>

<style scoped>
footer{
    margin-top: 30px;
    text-align: center;
}
</style>