import { createApp, VueElement } from 'vue'
import App from './App.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import router from './routes';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
