<template>
    <transition-group tag="ul" name="orderlist">
        <OrderView @see-order="$emit('see-order', order._id, order.status)" 
                :order="order" :key="order._id" v-for="order in orders"/>
    </transition-group>
</template>

<script>
import OrderView from './OrderView'
export default {
    name: 'OrderList',
    props: {
        orders: Array
    },
    components:{
        OrderView
    },
    emits: ['see-order']
}
</script>

<style scoped>
ul{
    width: fit-content;
    margin-top: 15px; 
    padding: 10px 10px;
    border-radius: 0.2em;
    background-image: linear-gradient(to right, #adb6bb,#dedad4);  
}

.orderlist-enter-from{
    opacity: 0;
    transform: scale(0.6) rotate(10deg);
}
.orderlist-enter-to{
    opacity: 1;
    transform: scale(1);
}
.orderlist-enter-active{
    transition: all 0.6s ease;
}
</style>