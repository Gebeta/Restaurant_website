<template>
    <transition-group name="fade" tag="div">
    <div class="modal-overlay" v-if="showDrivers" key="101"></div>
    <div class="modal" v-if="showDrivers" key="102" style="max-width: 800px;">
        <span @click="$emit('close')" class="close">&times;</span>
        <GoogleMap
            api-key="AIzaSyBU3yLIby2cfztVA9BACvDG1THm8r5WIFg"
            style="width: 100%; height: 400px; margin-bottom: 5px;"
            :center="JSON.parse(restaurant.address)"
            :zoom="12">
            <Marker :options="{ position: JSON.parse(restaurant.address), label: 'R', title: 'restaurant'}" />

            <Marker v-for="driver in activeDrivers" 
                    :key="driver._id"  
                    :options="{ position: JSON.parse(driver.address), 
                    title: driver.first_name, 
                    icon: 'https://i.ibb.co/2Ss4v1N/dd.png'}"
                    @click="onClick(driver._id)" />
        </GoogleMap> 
        <p ref="driverSelected" style="margin-top:3em">Select a Driver</p>
        <button @click="$emit('select-driver')">Call Driver</button>
    </div>
    </transition-group>
</template>

<script>
import { GoogleMap, Marker } from 'vue3-google-map'
export default {
    props:{
        showDrivers: Boolean,
        drivers: Object,
        center: String,
        orderId: String
    },
    data(){
        return{
            restaurant: null,
            activeDrivers: []
        }
    },
    components:{
        GoogleMap, 
        Marker
    },
    methods:{
        async onClick(f){
            let driver = this.activeDrivers.find((d)  => d._id === f)
            this.$refs.driverSelected.innerHTML = driver.first_name + ' ' + driver.last_name 
            
            const orderToChg = await this.fetchOrder(this.orderId)
            let updOrder = {...orderToChg, status: 'assigned', driver_id: f}

            const res = await fetch(`api/order/${this.orderId}`,{
                method: 'PUT',
                headers: this.getHeader(),
                body: JSON.stringify(updOrder)
            })
            const data = await res.json()
            if(data){
                this.$emit('assigned')
            }else{
                this.$refs.driverSelected.innerHTML = "Error occured"
            }
        },
        async fetchDrivers(){
            const res = await fetch('api/driver',{headers: this.getHeader()})
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
        }
    },
    async created(){
        let id = JSON.parse(localStorage.getItem('id'))
        const res = await fetch(`api/restaurant/${id}`,{headers: this.getHeader()})
        var drivers = await this.fetchDrivers()
        this.restaurant = await res.json()
        this.activeDrivers = drivers.filter(d => d.is_accepted == true)
    }
}
</script>

<style scoped src="@/assets/styles/popup.css">
</style>