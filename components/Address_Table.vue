<!-- src/components/AddressList.vue -->
<template>
    <div>
        <h2>Address Table</h2>
        <button @click="showCreateForm = true">Add Address</button>
        <table>
            <thead>
                <tr>
                    <th>Address ID</th>
                    <th>Account ID</th>
                    <th>Address Type ID</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="address in addresses" :key="address.AddressID">
                    <td>{{ address.AddressID }}</td>
                    <td>{{ address.AccountID }}</td>
                    <td>{{ address.AddressTypeID }}</td>
                    <td>{{ address.Address }}</td>
                    <td>
                        <button @click="editAddress(address)">Edit</button>
                        <button @click="deleteAddress(address.AddressID)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Create Form -->
        <div v-if="showCreateForm">
            <h3>Create Address</h3>
            <form @submit.prevent="createAddress">
                <label>Account ID:</label>
                <input v-model="newAddress.AccountID" type="number" required>
                <label>Address Type ID:</label>
                <input v-model="newAddress.AddressTypeID" type="number" required>
                <label>Address:</label>
                <input v-model="newAddress.Address" required>
                <button type="submit">Create</button>
                <button @click="showCreateForm = false">Cancel</button>
            </form>
        </div>

        <!-- Edit Form -->
        <div v-if="showEditForm">
            <h3>Edit Address</h3>
            <form @submit.prevent="updateAddress">
                <label>Account ID:</label>
                <input v-model="currentAddress.AccountID" type="number" required>
                <label>Address Type ID:</label>
                <input v-model="currentAddress.AddressTypeID" type="number" required>
                <label>Address:</label>
                <input v-model="currentAddress.Address" required>
                <button type="submit">Update</button>
                <button @click="showEditForm = false">Cancel</button>
            </form>
        </div>
    </div>
</template>

<script>
import apiService from '../apiService';

export default {
    data() {
        return {
            addresses: [],
            showCreateForm: false,
            showEditForm: false,
            newAddress: {
                AccountID: '',
                AddressTypeID: '',
                Address: ''
            },
            currentAddress: {}
        };
    },
    methods: {
        async fetchAddresses() {
            try {
                const response = await apiService.getAddresses();
                this.addresses = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async createAddress() {
            try {
                await apiService.createAddress(this.newAddress);
                this.fetchAddresses();
                this.showCreateForm = false;
                this.newAddress = {
                    AccountID: '',
                    AddressTypeID: '',
                    Address: ''
                };
            } catch (error) {
                console.error(error);
            }
        },
        editAddress(address) {
            this.currentAddress = { ...address };
            this.showEditForm = true;
        },
        async updateAddress() {
            try {
                await apiService.updateAddress(this.currentAddress.AddressID, this.currentAddress);
                this.fetchAddresses();
                this.showEditForm = false;
            } catch (error) {
                console.error(error);
            }
        },
        async deleteAddress(id) {
            try {
                await apiService.deleteAddress(id);
                this.fetchAddresses();
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.fetchAddresses();
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>
