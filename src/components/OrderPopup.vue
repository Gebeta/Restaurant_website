<template>
      <transition-group name="fade" tag="div">
        <div class="modal-overlay" v-if="showOrder" key="101"></div>
        <div v-if="showOrder" class="modal" key="103">
            <span @click="$emit('close')" class="close">&times;</span>
            <p style="font-size:2em">Order Details</p><span style="float:right;color:green">{{order.status}}</span><hr>
            <p><i>client: </i>{{order.client_id.first_name}} {{order.client_id.last_name}}</p>
            <p><i>Orders made: </i>{{order.client_id.no_of_orders}}</p>
            <p><i>phone: </i>{{order.client_id.phone_no}}</p><hr>
            <span v-for="itm in order.items" :key="itm.id">{{itm.quantity}} {{itm._id.foodName}}{{(itm.quantity > 1) ? 's':''}},</span>
            <p><i>delivery fee: </i>{{order.deliveryfee}}</p>
            <p><i>Total Price: </i>{{order.totalPrice}}</p>
            <p><i>Assigned: </i>{{order.driver_id}}</p>
            <p><i>Intiated : </i>{{ order.created_at }}</p>
            <div v-if="order.status!='archived'">
                <hr>
                <button @click="$emit('call-driver')" v-if="order.status=='active'">Call Driver</button>
                <button @click="$emit('accept-order')" v-if="order.status=='pending'">Accept</button>
                <button @click="$emit('decline-order')">{{order.status=='pending'? 'Decline':' Abort '}}</button>
            </div>
        </div>
      </transition-group>
</template>

<script>
export default {
    props:{
        showOrder: Boolean,
        order: Object,
    }
}
</script>

<style scoped src="@/assets/styles/popup.css">
</style>