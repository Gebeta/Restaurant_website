<template>
    <li @dblclick="$emit('see-details')" 
        :class="[item.isServed ? 'avaliablity' : '', 'item']">
        <h3>
            {{item.foodName}}  
            <span>
                <label class="switch" @click="$emit('toggle-avaliablity')"><input type="checkbox" v-model="served"><span class="slider"></span></label>
                <img @click="$emit('delete-item')" src="../assets/trash-alt-regular.png" class="mod"/>
            </span>
        </h3>
        <hr style="width:80%;float:left"><br>
        <p id="desc"><span class="desc">Description: </span>{{item.description}}</p>
        <div class="images">
            <div v-for="image in item.imgLocation" :key="image" class="img-wrap">
                <span class="close" @click="deleteImg(item._id, image)">&times;</span>
                <img v-bind:src="'/api/images/'+ item._id + '/' + image" class="mod"/> 
            </div>
        </div>
        <hr>
        <p class="under"> 
            <span class="price"><span class="desc">Price: </span>{{item.price}} birr</span>
            <span @click="$emit('edit-item', id)"><i>edit</i><img src="../assets/edit-regular.png" class="mod"/></span>
        </p>
    </li>
</template>

<script>
export default{
    name: 'Item',
    props: {
        item: Object
    },
    data(){
        return{
            served: this.item.isServed
        }
    },
    methods:{
        deleteImg(id, img){
            this.$emit('delete-img', id, img)
        }
    }  
}
</script>
<style scoped src="@/assets/styles/item.css">
</style>