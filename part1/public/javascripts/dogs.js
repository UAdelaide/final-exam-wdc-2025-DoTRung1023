const { createApp } = Vue;

createApp({
    data() {
        return{
            dogImage: '',
            dogName: 'Buddy',
            dogBreed: 'Golden Retriver',
            dogAge: '3 years',
            dogDescription: 'A friendly and energetic dog who loves long walks and playing fetch.'
        }
    },
    async mounted(){
        this.fetchNewDog();
    },
    methods: {
        async fetchNewDog(){
            try {
                const response = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await response.json();
                this.dogImage = data.message;
            } catch (error) {
                this.dogImage = '';
            }
        }
    }
}).mount('#app');
