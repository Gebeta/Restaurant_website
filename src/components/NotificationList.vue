<template>
    <transition-group tag="div" class="notifications-list"  name="list">
      <Notification 
        @remove-notification="this.$emit('remove-notification',notification.id)"
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"/>
  </transition-group>
</template>

<script>
import Notification from './Notification';

export default {
    name: 'NotificationList',
    props:{
        notifications: Array
    },
    components: {
        Notification
    }
}
</script>

<style>
.notifications-list{
    position: fixed;
    bottom: 0;
    right: 0;
    margin-right: 15px;
    width: 320px;
}

.list-enter-from{
    opacity: 0;
    transform: scale(0.6);
}
.list-enter-to{
    opacity: 1;
    transform: scale(1)
}
.list-enter-active{
    transition: all 0.6s ease;
}

.list-leave-from{
    opacity: 1;
    transform: scale(1);
}

.list-leave-to{
    opacity: 0;
    transform: scale(0.6)
}
.list-leave-active{
    transition:all 0.6s ease;
}
</style>