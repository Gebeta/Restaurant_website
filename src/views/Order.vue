<template>
    <Header :title="title"/><hr>
    <h2 style="color:green">Active orders</h2>
    <OrderList :orders="activeOrders" @see-order="seeOrder"/>
    <hr>
    <h2 style="color:orange;">Pending orders</h2>
    <OrderList :orders="pendingOrders"  @see-order="seeOrder"/>
    <hr>
    <h2 style="color:brown">Archived Orders</h2>
    <OrderList :orders="archivedOrders" @see-order="seeOrder"/>
    <OrderPopup  :showOrder="showOrder" @decline-order="DeclineOrder" 
                @close="showOrder=false" :order="order" @call-driver="callDriver"/>
    <NotificationList :notifications="notifications" 
        @remove-notification="removeNotification"/>
</template>

<script>
import Header from '../components/Header'
import OrderList from '../components/OrderList'
import OrderPopup from '../components/OrderPopup'
import NotificationList from '../components/NotificationList'

export default {
    name: 'Orders',
    components:{
        Header,
        OrderList,
        OrderPopup,
        NotificationList
    },
    data(){
        return{
            title: '',
            order: [],
            showOrder: false,
            activeOrders: [],
            pendingOrders: [],
            archivedOrders: [],
            notifications: []
        }
    },
    methods:{
        async fetchOrders(){
            const id = JSON.parse(localStorage.getItem('id'))
            const res = await fetch(`api/order/r/${id}`,{headers: this.getHeader()})
            const data = await res.json()
            return data
        },
        async fetchOrder(id){
            const res = await fetch(`api/order/${id}`,{headers: this.getHeader()})
            const data = await res.json()
            return data
        },
        getHeader(){
            const token = JSON.parse(localStorage.getItem('token'))
            return {'Content-type': 'application/json', 'Authorization': ' Bearer ' + token}
        },
        calcDate(orderTime,timeNow){
            let day = timeNow.getDate() - orderTime.split('-')[2].split('T')[0]
            switch(day){
                case 0:
                    return this.calcHour(orderTime,timeNow)
                case 1:
                    return 'yesterday'
                case 2:
                    return 'before yesterday'
                default:
                    return day + ' days ago'
            }
        },
        calcHour(orderTime,timeNow){
            let hour = timeNow.getHours() - orderTime.split(':')[0].split('T')[1]
            if(hour == 0){return this.calcMinutes(orderTime,timeNow)}
            if(hour > 10){return 'today'}
            return hour + ' hours ago'   
        },
        calcMinutes(orderTime,timeNow){
            let minute = timeNow.getMinutes() - orderTime.split(':')[1]
            return minute + ' minutes ago'
        },
        async DeclineOrder(){
            const orderToChg = await this.fetchOrder(this.order._id)
            let updOrder = {}
            switch(this.order.status){
                case 'active':
                    updOrder = {...orderToChg, status: 'pending'}
                    break
                case 'pending':
                    updOrder = {...orderToChg, status: 'archived'}
                    break
                default:
                    return
            }

            const res = await fetch(`api/order/${this.order._id}`,{
                method: 'PUT',
                headers: this.getHeader(),
                body: JSON.stringify(updOrder)
            })
            this.showOrder = false
            const data = await res.json()
            if(data){this.addNotification({id: data._id,message: 'order status changed to ' + data.status, type: 'success'})}
            this.initiate()
        },
        callDriver(){
            alert('Will be Implemented Soon!')
        },
        seeOrder(id,status){
            switch(status){
                case 'active':
                    this.order = this.activeOrders.find((o) => o._id == id)
                    break
                case 'pending':
                    this.order = this.pendingOrders.find((o) => o._id == id)
                    break
                case 'archived':
                    this.order = this.archivedOrders.find((o) => o._id == id)
            }
            this.showOrder = true
        },
        async initiate(){
            let orders = await this.fetchOrders()
            let time = new Date()
            orders.forEach((o) => { 
                o.created_at = this.calcDate(o.created_at,time)
            })
            this.activeOrders = orders.filter(o => o.status == 'active')
            this.pendingOrders = orders.filter(o => o.status == 'pending')
            this.archivedOrders = orders.filter(o => o.status == 'archived')
        },
        addNotification(notif){
            this.notifications.push(notif)
        },
        removeNotification(id){
            this.notifications = this.notifications.filter((notif) => notif.id !== id)
        }

    },
    async created(){
        this.title = JSON.parse(localStorage.getItem('name'))
        this.initiate()
    },
    emits:['change-mode']
}
</script>
<style>
h2,h3{
    margin-bottom: 0;
    padding-bottom: 0;
}
</style>