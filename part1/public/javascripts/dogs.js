const { createApp } = Vue;

createApp({
    data() {
        return{
            dogImage: '',
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
                console.error('Error fetching dog image:', error);
            }
        }
    }
}).mount('#app');
