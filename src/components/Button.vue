<template>
    <button :style="{backgroundImage: color}">{{text}} </button> 
</template>

<script>
export default {
    name: 'Button',
    props: {
        text: String,
        color: String
    }
}
</script>

<style scoped>
button{
    display: inline-block;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    margin: 5px;
    font-size: 15px;
    appearance: none;
    outline: none;
    font-weight: 700; 
    box-shadow: 3px 3px rgba(54, 52, 52, 0.4);
    transition: 0.4s ease-out;
}

button:hover {
    box-shadow: 1px 1px rgba(87, 81, 81, 0.6);
}

</style>

