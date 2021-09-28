<template>
    <Header :title="title" :approved="is_approved"/>
    <div class="head" v-if="is_approved">
        <Button 
            @click="toggleItem" 
            :text="showAddItem ? 'Close X' : 'Add Item' " 
            :color="showAddItem ? 'linear-gradient(to right, #914d3c, #dd6f5d)' : 'linear-gradient(to right, #4b423f, #736763)' "/>
        <div class="option">
            <b>Search </b><input type="text" v-model="search" name="search" @keyup="onSearch"/>
            <i> Sort by </i><select name="sort" @change="sortItems">
                <option value="name">name</option>
                <option value="price">price</option>
                <option value="date">Date</option>
            </select>
            <i> Mode </i><select id="mode" @change="onModeChange">
                <option value="light">Normal</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    </div>
    <AddItem @add-item="addItem" :showAddItem="showAddItem" v-if="is_approved"
        @add-notification="addNotification" :itm="itm" :update="update" :key="key"/>
    <Items @delete-item="del" @delete-img="deleteImg" @see-details="seeDetails" v-if="is_approved"
         @toggle-avaliablity="toggleR" @edit-item="editItem" :items="items" />
    <div class="lds-dual-ring" v-if="loadingState=='loading'"></div>
    <transition name="noItem">
        <div v-if="loadingState=='done'" class="container" style="width:800px">
            <h1>{{ is_approved ? 'There are no items in your menu. Please Add items!':
                'Yor request for Approval is pending!'}}</h1>
            <img src="../assets/empty.png" />
        </div>
    </transition>
    <Popup :showModal="showModal" :showItem="showItem" :itm="itm" @close="showItem=false" 
            @no-del="showModal=false" @del-item="deleteItem"/>
    <NotificationList :notifications="notifications" 
        @remove-notification="removeNotification"/>
</template>

<script>
import store from '../store'
import Header from '../components/Header'
import Button from '../components/Button'
import Items from '../components/Items'
import AddItem from '../components/AddItem'
import Popup from '../components/Popup'
import NotificationList from '../components/NotificationList' 

import axios from 'axios'

export default{
    name: 'Menu',
    components: {
        Header,
        Button,
        Items,
        AddItem,
        Popup,
        NotificationList,
    },
    data() {
        return{
            items: [],
            is_approved: false,
            title: '',
            notifications: [],
            showModal: false,
            showItem: false,
            search: '',
            itm: [],
            delId: '',
            key: '',    
            showAddItem: false,
            update: false,
            loadingState: ''
        }
    },
    methods: {
        async deleteItem(){
            const res =  await fetch(`api/items/${this.delId}`, {
                method: 'DELETE',
                headers: this.getHeader(),
            })
            const data = await res.json()
            if(res.status === 200){
                this.items = this.items.filter((item) => item._id !== this.delId)
                this.addNotification({id: this.delId, message: data.message,type: 'success'})
            } else{
                this.addNotification({id: 7,message: 'Error deleting item',type: 'success'})
            }
            this.showModal = false
        },
        async seeDetails(id){
            this.itm = this.items.find((item)  => item._id === id)
            this.showItem = true
        },
        async toggleR(id){
            const itemToToggle = await this.fetchItem(id)
            const updItem = {...itemToToggle, isServed: !itemToToggle.isServed}

            const res = await fetch(`api/items/${id}`,{
                method: 'PUT',
                headers: this.getHeader(),
                body: JSON.stringify(updItem)
            })

            const data = await res.json()
            if(data && data.isServed){this.addNotification({id: data._id,message: data.foodName + ' is now avaliable', type: 'success'})}
            this.items = this.items.map((item)  => item._id === id ? {...item, isServed: data.isServed} : item)
        },
        async addItem(formData, newItem){
            if(!this.update){
                newItem.restaurandId = JSON.parse(localStorage.getItem('id'))
                const res = await fetch('api/items', {
                    method: 'POST',
                    headers: this.getHeader(),
                    body: JSON.stringify(newItem)
                })

                const data = await res.json()
                if(res.status === 200){
                    this.addImages(formData, data)
                    this.loadingState=''
                    this.addNotification({id: data._id,message: 'Item '+ data.foodName +' Added!',type: 'success'})
                }else{
                    this.addNotification({id: data._id,message: data.message,type: 'dismissible'})
                }
            }else{this.updateItem(formData, newItem)}
        },
        async updateItem(formData, newItem){
             const res = await fetch(`api/items/${this.itm._id}`,{
                method: 'PUT',
                headers: this.getHeader(),
                body: JSON.stringify(newItem)
            })  
            
            const data = await res.json()
            if(res.status === 200){ 
                if(formData){
                    this.addImages(formData,data)
                }else{this.items = this.items.map((item)  => item._id === data._id ? item = data : item )}
                this.addNotification({id: data._id,message: 'Item '+ data.foodName +' Updated!',type: 'success'})
            }else{
                this.addNotification({id: data._id,message: data.message,type: 'dismissible'})
            }
        },
        editItem(id){
            this.itm = this.items.find((item)  => item._id === id)
            this.key = "data-v-"+ Math.floor(Math.random() * 1000)
            store.commit('toggleUpdate')
            this.showAddItem = store.showAddItem
            this.update = store.update
            window.scrollTo(0,150);
        },
        async addImages(formData,data){
            try {
                var isNewItem = this.update ? false : true
                formData.append("itemId", data._id)
                formData.append("isNewItem",isNewItem)
                const res = await axios.post('api/images/upload',formData, {headers: this.getHeader()}).then((result) => {return result;})
                this.addNotification({id: 101,message: res.data.message,type: 'success'})
                if(this.update){
                    this.items = this.items.map((item)  => item._id === data._id ? item = data : item )
                }else{this.items = [...this.items, data]}
            } catch(err){
                this.addNotification({id: 101,message: err,type: 'dismissible'})
            }
        },
        async deleteImg(id, img){
            const res = await fetch(`api/images/${id}`,{
                method: 'PUT',
                headers: this.getHeader(),
                body: JSON.stringify({img: img})
            })  

            const data = await res.json()
            if(res.status === 200){
                this.items = this.items.map((item)  => item._id === id ? item = data : item )
                this.addNotification({id: data._id,message: 'Image '+ img +' Deleted!',type: 'success'})
            }
        },
        async fetchItems(){
            const id = JSON.parse(localStorage.getItem('id'))
            const res = await fetch(`api/items/menu/${id}`,{headers: this.getHeader()})
            const data = await res.json()
            return data
        },
        async fetchItem(id){
            const res = await fetch(`api/items/${id}`,{headers: this.getHeader()})
            const data = await res.json()
            return data
        },
        del(id){ 
            this.showModal = true 
            this.delId = id
        },
        getHeader(){
            const token = JSON.parse(localStorage.getItem('token'))
            return {'Content-type': 'application/json', 'Authorization': ' Bearer ' + token}
        },
        addNotification(notif){
            let show = true;
            this.notifications.forEach((n) => {if(n.id == notif.id){show = false}})
            if(show){this.notifications.push(notif)}
        },
        removeNotification(id){
            this.notifications = this.notifications.filter((notif) => notif.id !== id)
        },
        toggleItem(){
            store.commit('toggleItem')
            this.update = false
            this.showAddItem = store.showAddItem
        },
        sortItems(e){
            switch(e.target.value){
                case('name'):
                    this.items.sort((a, b) => a.foodName.localeCompare(b.foodName))
                    break
                case('price'):
                    this.items.sort((a, b) => b.price - a.price)
                    break
                case('date'):
                    this.items.sort((a, b) => a.created_at.localeCompare(b.created_at))
            }
        },
        onModeChange(e){
            let m = e.target.value == "light" ? true : false;
            localStorage.setItem('mode',JSON.stringify(m))
            this.$emit('change-mode',false)
        },
        async onSearch(){
            this.items = await this.fetchItems()
            if(this.search == ''){
                this.loadingState = ''
                return
            }
            let found;
            this.items.find(o => {
                if(o.foodName[0].toLowerCase() === this.search[0] | o.foodName[0] === this.search[0] ){
                    found = o;
                }
            });
            this.items = []
            if(found){
                this.items.push(found)
                this.loadingState = ''
            }else{this.loadingState = 'loading'}
        }
    },
    async created(){
        this.loadingState = 'loading'
        this.title = JSON.parse(localStorage.getItem('name'))
        let id = JSON.parse(localStorage.getItem('id'))
        this.is_approved = JSON.parse(localStorage.getItem('is_approved'))
        const res = await fetch(`api/restaurant/${id}`,this.getHeader())
        let rest = await res.json()
        await store.commit('setApproved',arguments[1]= rest.is_approved)
        this.items = await this.fetchItems()
        if(this.items!=0){this.loadingState=''}
        this.$emit('change-mode',true)
        setTimeout(() => {
            if(this.items==0){
                this.loadingState = 'done'
            }
            if(!this.is_approved){this.loadingState = 'done'}
        }, 2000);
    },
    emits:['change-mode']
}
</script>
<style scoped src="@/assets/styles/menu.css">
</style>