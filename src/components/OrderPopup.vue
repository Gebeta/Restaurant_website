<template>
      <transition-group name="fade" tag="div">
        <div class="modal-overlay" v-if="showOrder" key="101"></div>
        <div v-if="showOrder" class="modal" key="103">
            <span @click="$emit('close')" class="close">&times;</span>
            <p>Order Details</p><hr>
            <p><i>client: </i>{{ order.client_id}}</p>
            <p><i>Status: </i>{{ order.status}}</p>
            <p><i>Items: </i>{{ order.items.length}}</p>
            <p><i>Total Price: </i>{{order.totalPrice}}</p>
            <p><i>Intiated time: </i>{{ order.created_at }}</p>
            <div v-if="order.status!='archived'">
                <hr>
                <button @click="$emit('call-driver')" v-if="order.status=='active'">Call Driver</button>
                <button @click="$emit('decline-order')">{{order.status=='active'? 'Decline':' Abort '}}</button>
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