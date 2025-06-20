const { createApp } = Vue;

createApp({
    data() {
        return{
            dogImage: ''
        }
    },
    mounted(){
        this.fetchNewDog();
    },
    methods: {
        async fetchNewDog(){

        }
    }
}).mount('#app');