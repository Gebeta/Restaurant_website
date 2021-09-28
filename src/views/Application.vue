<template>
    <div class="container">
        <h3>Step 2 of 2</h3>
        <hr>
        <form @submit.prevent="Register">
            <div class="mb-3 f">     
              <label>* TIN Number
                <input type="text" v-model="tin" placeholder="TIN">
              </label>
            </div>
            <div class="mb-3 f">
                <label>* Business License
                  <input type="file" ref="tradeLicense" v-on:change="handleFileUpload()" class="file"/>
                </label>
                <span class="info">Upload government Issued Trade license of your restaurant</span>
            </div>
            <div class="mb-3 f">
               <label>* Your kebele ID-Card
                <input type="file" ref="idCard" v-on:change="handleFileUpload()" class="file"/>
              </label>
              <span class="info">Upload government Issued ID</span>
            </div>
            <div class="mb-3 f">
               <label>* Restaurant Picture
                <input type="file" ref="restPic" v-on:change="handleFileUpload()" class="file"/>
              </label>
              <span class="info">Please upload a picture of your restaurant</span>
            </div>
            <div class="mb-3">
                <input type="email" v-model="email" placeholder="Email">
            </div>
            <div class="mb-3">     
                <input type="password" v-model="password" placeholder="Password">
            </div>
            <div class="mb-3">         
                <input type="password" v-model="confirm_password" placeholder="confirm Password">
            </div>      
            <button type="submit">Register</button>
            <div class="mb-3"><br/>
                <label>Have account <router-link to='/'>Login here</router-link></label>
            </div>
        </form>
    </div>
    <NotificationList :notifications="notifications" @remove-notification="removeNotification"/>
</template>

<script>
import '@/assets/styles/style.css';
import NotificationList from '../components/NotificationList'
import axios from 'axios'
export default {
    name:'Application',
    props:{
      name: String,
      phone: String,
      location: String,
    },
    data(){
      return {
        tin: '',
        tradeLicense: null,
        idCard: null,
        restPic: null,
        email: '',
        password: '',
        confirm_password: '',
        notifications: []
      }
    },
    components:{
      NotificationList
    },
    methods: {
        async Register(){
            if(!this.email | !this.password | !this.tin){
                this.showNotification("Empty feilds!",1006)
                return
            } else if(!this.tradeLicense | !this.idCard | !this.restPic){
                this.showNotification("Plase Upload files required!",1005)
            } else if(this.checkFile(this.restPic) | 
                    this.checkFile(this.tradeLicense) |
                    this.checkFile(this.idCard)){
                return
            } else if(!this.tin.match(/^\d{9}$/)){
                this.showNotification('Invalid TIN Number',1007)
                return
            } else if(this.confirm_password === this.password){
              const obj = {
                tin: this.tin,
                name: this.name,
                phone_no: this.phone,
                address: this.location,
                email:this.email,
                password:this.password,
                restPic: this.restPic.name,
                idCard: this.idCard.name,
                business_license: this.tradeLicense.name
              };

              const res = await fetch('api/auth/signup', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify(obj)
              })

              const data = await res.json()
              if(res.status === 200){
                    this.submitFile(data._id);
              }else{
                    this.showNotification(data.message,1002)
              }
            }else{
              this.showNotification('password doesn\'t match',1001)
            }
        },
        async submitFile(id){
            let formData = new FormData();
            var fileNames = JSON.stringify([this.tradeLicense.name,this.idCard.name,this.restPic.name])
            formData.append('restId',id);
            formData.append('restImg', this.tradeLicense);
            formData.append('restImg', this.idCard);
            formData.append('restImg', this.restPic);
            formData.append('fileNames',fileNames)
            await axios.post( 'api/images/rupload',formData,{headers: {'Content-Type': 'multipart/form-data'}})
              .catch(function(){this.showNotification('Image upload failed',1111)});
            this.$router.push('/')
        },
        handleFileUpload(){
          this.tradeLicense = this.$refs.tradeLicense.files[0];
          this.idCard = this.$refs.idCard.files[0];
          this.restPic = this.$refs.restPic.files[0];
        },
        showNotification(msg,nid){
            let show = true;
            this.notifications.forEach((notif) => {if(notif.id == nid){show = false}})
            if(show){this.notifications.push({id: nid,message: msg,type: 'dismissible'})}
        },
        checkFile(file){
          let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png','application/pdf'];
          if(allowedExtension.indexOf(file.type)==-1){
              this.showNotification('unsupported '+file.type+' file selected!',file.name)
              return true
          }
          return false
        },
        removeNotification(id){
            this.notifications = this.notifications.filter((notif) => notif.id !== id)
        },
    },emits:['change-mode'] 
}
</script>
<style scoped>
.container{
    height:700px;
}
.file{
  border: none;
  height: 20px;
  background: #F5F7F9;
}
.info{
  margin-left: 2ex;
  color: #222;
  font-weight: lighter;
  font-size: 12px;
}
.f{
  font-weight: bold;
  text-align: left;
}
h3{
  color:black;
  margin-bottom: 0ex;
}
hr{
  margin-bottom: 2ex;
}
</style>