const { createApp } = Vue;

createApp({
    data() {
        return{
            dogImage: '',
            dogName: 'Buddy',
            dogBreed: 'Golden Retriver',
            dogAge: '3 years',
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
                this.dogImage = 'https://via.placeholder.com/400x300?text=Dog+Photo';
            }
        }
    }
}).mount('#app');
