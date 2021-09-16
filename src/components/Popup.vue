<template>
      <transition-group name="fade" tag="div">
        <div class="modal-overlay" v-if="showModal | showItem" key="101"></div>
        <div class="modal" v-if="showModal" key="102">
            <h1>Are you sure?</h1>
            <p>Deleting Item</p>
            <div>
                <button @click="$emit('del-item')">Yes</button>
                <button @click="$emit('no-del')">No</button>
            </div>
        </div>
        <div v-if="showItem" class="modal" key="103">
            <span @click="$emit('close')" class="close">&times;</span>
           <p><i>Food: </i>{{ itm.foodName}}</p><hr>
           <p><i>Avaliable: </i>{{ itm.isServed ? 'yes':'no'}}</p>
           <p><i>Id: </i>{{ itm._id}}</p>
           <i>Catagory: </i><span v-for="c in itm.catagory" :key="c">{{c}}, </span>
           <p><i>Description: </i>{{ itm.description}}</p>
           <p><i>Price: </i>{{ itm.price}} birr</p>
           <i>Images: </i><span v-for="img in itm.imgLocation" :key="img">{{img}}, </span>
           <p><i>Updated: </i>{{ udate }}</p>
           <p><i>Created: </i>{{ cdate }}</p>
        </div>
      </transition-group>
</template>

<script>
export default {
    props:{
        showModal: Boolean,
        showItem: Boolean,
        itm: Object,
    },
    data(){
        return{
            cdate: '',
            udate: ''
        }
    },
    methods:{
        calcDate(date,today){
            let day = today - date.split('-')[2].split('T')[0]
            switch(day){
                case 1:
                    return 'today'
                case 2:
                    return 'yesterday'
                default:
                    return day + ' days ago'
            }
        }
    },
    updated(){
        if(this.showItem){
            var date = new Date()
            let today = date.getDate()
            if(this.itm){
                this.cdate = this.calcDate(this.itm.updatedAt,today)
                this.udate = this.calcDate(this.itm.created_at,today)
            }
        }
    }
}
</script>

<style scoped src="@/assets/styles/popup.css">
</style>