<template>
    <transition-group name="item" tag="ul">
        <Item 
            @delete-item="this.$emit('delete-item', item._id)"
            @delete-img="deleteImg"
            @see-details="this.$emit('see-details', item._id)"
            @toggle-avaliablity="this.$emit('toggle-avaliablity', item._id)"
            @edit-item="this.$emit('edit-item', item._id)" 
            v-for="item in items"
            :key="item._id"
            :item="item"/>
    </transition-group>
</template>

<script>
import Item from './Item'
export default {
    name: 'Items',
    props: {
        items: Array
    },
    components: {
        Item
    },
    methods:{
        deleteImg(id, img){
            this.$emit('delete-img',id, img)
        }
    },
    emits: ['delete-item','see-details','toggle-avaliablity','edit-item','delete-img']
}
</script>

<style scoped>
ul{
    padding: 0;
    margin: 0;
}
ul li{
    display: inline-table;
}

.item-enter-from{
    opacity: 0;
    transform: scale(0.6);
    -webkit-transform: scale(0.6);
    -moz-transform: scale(0.6);
}
.item-enter-to{
    opacity: 1;
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
}
.item-enter-active{
    transition: all 0.6s ease;
    -webkit-transition: all 0.6s ease;
    -moz-transition: all 0.6s ease;
}
</style>

