// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LookupList from '../components/LookupList.vue';
import AccountList from '../components/AccountList.vue';
import AddressList from '../components/AddressList.vue';
// Import other components as needed

const routes = [
    { path: '/lookups', component: LookupList },
    { path: '/accounts', component: AccountList },
    { path: '/addresses', component: AddressList },
    { path: '/account-statuses', component: AccountStatusList },
    // Add other routes as needed
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
