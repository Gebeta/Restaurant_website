<template>
    <transition name="img">
        <img class="watermark" src="../assets/logo.png" v-if="showAddItem"/>
    </transition>
    <transition name="slide">
    <form @submit="onSubmit" class="add-form" v-if="showAddItem">
        <div class="form-control">
            <label for="foodName">Food Item</label>
            <input type="text" v-model="foodName" name="foodName" placeholder="Add food name">
        </div>
        <div class="form-control">
            <label for="description">Item Description</label>
            <textarea type="text" v-model="description" name="description" placeholder="write some description about the food"/>
        </div>
        <div class="form-control">
            <fieldset>
                <legend><b>Catagory</b></legend>
                <div class="select" @click="onSelect">
                    <p id="injera">Injera Dish</p>
                    <p id="vegetable">Vegetable</p>
                    <p id="meat">Meat Dish</p>
                    <p id="western">Western Dish</p>
                    <p id="spicy">Spicy</p>
                </div>
            </fieldset>
        </div>
        <div class="form-control">
            <label for="price">Price </label>
            <input type="text" v-model="price" name="price">
        </div>
        <div class="form-control form-control-check">
            <label for="isServed">Is avaliable?</label>
            <input type="checkbox" v-model="isServed" name="isServed"/>
        </div>
        <div class="form-control">
            <label for="itemImg">Add Items picture</label>
            <span v-if="update">{{itm.imgLocation}}</span>
            <input type="file" ref="itemImg" @change="selectFile" multiple accept=".jpg, .jpeg, .png, .gif, .bmp"/>
        </div>
        <input class="btn" type="submit" :value="update ? 'Update Item' : 'Save Item' ">
    </form>
    </transition>
</template>

<script>
import store from '../store'
export default{
    name:'AddItem',
    props: {
        itm: Object,
        update: Boolean,
        showAddItem: Boolean
    }, 
    data(){
        return{
            foodName: '',
            description: '',
            catagory: [],
            price: 0,
            isServed: false,
            itemImg: null
        }
    },
    methods: {
        onSubmit(e){
            e.preventDefault()

            if(!this.foodName){
                this.showNotification("Food name Empty!")
                return
            }

            if(this.catagory.length == 0){
                this.showNotification("Please select foods catagory!")
                return
            }

            if(!this.itemImg && !this.update){
                this.showNotification('Please at least add one image')
                return
            }

            if(!this.itemImg && this.update){
                this.$emit('add-item', null , this.newItem(this.itm.imgLocation))
                this.clearFields()
                return
            }
            const imgData = this.checkImages()
            if(imgData){
                this.$emit('add-item', imgData[0] , this.newItem(imgData[1]))
                this.clearFields()
            }
        },
        selectFile(){
            this.itemImg = this.$refs.itemImg.files
        },
        showNotification(msg){
            this.$emit('add-notification',{id: 0,message: msg,type: 'dismissible'})
        },
        newItem(img){
            return {
                foodName: this.foodName,
                description: this.description,
                price: this.price,
                isServed: this.isServed,
                imgLocation: img,
                catagory: this.catagory,
                restaurandId: store.id
            }
        },
        checkImages(){
            var formData = new FormData()
            
            var len = this.itemImg.length;
            if(len>5 || (this.update && this.itm.imgLocation.length + len) > 5){
                this.showNotification('Too much files selected! (max is 5)')
                return
            }

            var images = []
            let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png','image/gif','image/bmp'];
            for(var i = 0; i < len; i++)
            {
                var file = this.itemImg[i];
                if(allowedExtension.indexOf(file.type)==-1){
                    this.showNotification('unsupported '+file.type+' file selected!')
                    return
                }
                images[i] = Math.floor(Math.random() * 1000000) + '.' + file.name.split('.').pop()
                formData.append("itemImg", file)
            } 
            formData.append("imgs", JSON.stringify(images))
            if(this.update){images = [...this.itm.imgLocation, ...images]}
            return [formData , images]
        },
        onSelect(e){
            if(e.target.id){
                let isSelected = false;
                this.catagory.forEach((c) => {if(c == e.target.id){isSelected = true}})
                if(isSelected){
                    this.catagory = this.catagory.filter((value) => { 
                        return value != e.target.id
                    })
                    e.target.setAttribute("style","background-color: #ddd; color: black")
                } else {
                    this.catagory.push(e.target.id)
                    e.target.setAttribute("style","background-color: #6b9b6be8;color: white;")
                }
            }
        },
        setFields(){
            this.foodName = this.itm.foodName
            this.description = this.itm.description
            this.price = this.itm.price
            this.isServed = this.itm.isServed
        },
        setCatagory(){
            this.catagory.map((id) => {
                document.getElementById(id).setAttribute("style","background-color: #ddd;color: black;");
            })
            this.catagory = this.itm.catagory
            this.itm.catagory.map((id) => {
                document.getElementById(id).setAttribute("style","background-color: #6b9b6be8;color: white;")
            })
        },
        clearFields(){
            this.foodName = ''
            this.description = ''
            this.price = 0
            this.isServed= false
            this.$refs.itemImg.value = null
            this.itemImg = null
        }
    },
    created(){
        this.$nextTick(function () {
            if(this.update){
                this.setFields()
                this.setCatagory()
            }
        })
    },
    emits: ["add-item","add-notification"]
}
</script>
<style scoped src="@/assets/styles/addItem.css">
</style>