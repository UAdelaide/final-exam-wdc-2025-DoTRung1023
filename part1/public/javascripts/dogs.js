const { createApp } = Vue;

createApp({
    data() {
        return{
            dogImage: '',
            dogName: '',
            dogBreed: '',
            dogAge: '',
            dogDescription: ''
        }
    },
    mounted(){
        this.fetchNewDog();
    },
    methods: {
        async fetchNewDog(){
            try {
                const response = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await response.json();
                this.dogImage = data.message;
            } catch (error) {
                this.dogImage = 'https:'
            }
        }
    }
}).mount('#app');