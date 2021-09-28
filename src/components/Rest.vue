<template>
  <p><b>Phone: </b>{{restaurant.phone_no}}</p>
  <p><b>Email: </b>{{restaurant.email}}</p>
  <p><b>Tin: </b>{{restaurant.tin}}</p>
  <img v-if="restaurant.name" :src="'/api/images/' + restaurant._id + '/' + restaurant.restPic"/>
</template>

<script>
export default {
name: 'Rest',
    props: {
        restaurant: Object
    } 
}
</script>
<style scoped>
img{
  width: 400px;
  height: 300px;
}
</style>
