<template>
    <li :class="['order '+order.status]" @click="$emit('see-order')">
        <p><i>client: </i>{{order.client_id}}</p>
        <hr>
        <p>{{order.items.length}} <i><b>items</b></i></p> 
        <p><i>Total Price: </i>{{order.totalPrice}} <i>birr</i></p>
        <hr> 
        <p class="time">{{order.created_at}} </p> 
    </li>
</template>

<script>
export default {
    name: 'Order',
    props: {
        order: Object
    }
}
</script>

<style scoped>
.order{
    width: fit-content;
    list-style: none;
    margin-right: 1em;
    margin-bottom: 0.6em;
    display: inline-table;
    background: #fffdfd;
    cursor: pointer;
    padding: 15px 20px;
    border-radius: 0.5em;
    box-shadow: 2px 2px rgba(190, 187, 186, 0.4);
}

.order.pending{
    border-left: 3px solid #e0ac4a;
}

.order.active{
    border-left: 3px solid green;
}

.order.archived{
    border-left: 3px solid rgb(128, 47, 0);
}

.order:hover{
    box-shadow: 4px 4px rgba(148, 136, 133, 0.4);
}

p{
    margin-top: 0%;
    margin-bottom: 0%;
    font-family: serif;
    font-weight: bold;
}

i{
    font-weight: lighter;
    color: darkslategray;
}

.time{
    padding: 0;
    margin: 0;
    text-align: right;
    font-size: 0.8em;
    color: teal;
}
</style>