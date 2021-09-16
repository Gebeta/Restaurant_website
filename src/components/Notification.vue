<template>
   <div :class="typeClass" class="alert" role="alert">
     <p>{{ notification.message }}</p>
    <button @click="closeNotification" type="button">
      <span class="close">&times;</span>
    </button>
  </div>
</template>

<script>

export default {
    name : 'Notification',
    props: {
        notification: Object
    },
    data() {
        return {
            timeout: null
        };
    },
    methods:{
        closeNotification(){
            this.$emit("remove-notification",this.notification.id)
        }
    },
    computed: {
        typeClass() {
            return `alert-${this.notification.type}`;
        }
    },
    created() {
        this.timeout = setTimeout(() => {
            this.$emit("remove-notification",this.notification.id)
        }, 5000);
    },
    beforeUnmount() {
        clearTimeout(this.timeout);
    }
}
</script>

<style scoped>

.alert{
    display: flex;
    justify-content: space-between;
    position:relative;
    padding:0.5rem 1rem;
    margin-bottom:1rem;
    border:1px solid transparent;
    border-radius:.25rem;
}

.alert-success{
    color:#0f5132;
    background-color:#d1e7dd;
    border-color:#badbcc;
}

.alert-dismissible{
    color:#852b2b;
    background-color:#e7d6d1;
    border-color:#dbbcba;
}

button{
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    padding: .25em .25em;
    color: #000;
    background: transparent;
    box-shadow: 0px 0px;
    border: 0;
    border-radius: .25rem;
    opacity: .5;
}

.close{
    font-size: 20px;
}

</style>