<!-- src/components/AccountStatusList.vue -->
<template>
    <div>
        <h2>Account Status Table</h2>
        <button @click="showCreateForm = true">Add Account Status</button>
        <table>
            <thead>
                <tr>
                    <th>Status ID</th>
                    <th>Status Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="status in accountStatuses" :key="status.StatusID">
                    <td>{{ status.StatusID }}</td>
                    <td>{{ status.StatusName }}</td>
                    <td>
                        <button @click="editStatus(status)">Edit</button>
                        <button @click="deleteStatus(status.StatusID)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Create Form -->
        <div v-if="showCreateForm">
            <h3>Create Account Status</h3>
            <form @submit.prevent="createAccountStatus">
                <label>Status Name:</label>
                <input v-model="newStatus.StatusName" required>
                <button type="submit">Create</button>
                <button @click="showCreateForm = false">Cancel</button>
            </form>
        </div>

        <!-- Edit Form -->
        <div v-if="showEditForm">
            <h3>Edit Account Status</h3>
            <form @submit.prevent="updateAccountStatus">
                <label>Status Name:</label>
                <input v-model="currentStatus.StatusName" required>
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
            accountStatuses: [],
            showCreateForm: false,
            showEditForm: false,
            newStatus: {
                StatusName: ''
            },
            currentStatus: {}
        };
    },
    methods: {
        async fetchAccountStatuses() {
            try {
                const response = await apiService.getAccountStatuses();
                this.accountStatuses = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async createAccountStatus() {
            try {
                await apiService.createAccountStatus(this.newStatus);
                this.fetchAccountStatuses();
                this.showCreateForm = false;
                this.newStatus = {
                    StatusName: ''
                };
            } catch (error) {
                console.error(error);
            }
        },
        editStatus(status) {
            this.currentStatus = { ...status };
            this.showEditForm = true;
        },
        async updateAccountStatus() {
            try {
                await apiService.updateAccountStatus(this.currentStatus.StatusID, this.currentStatus);
                this.fetchAccountStatuses();
                this.showEditForm = false;
            } catch (error) {
                console.error(error);
            }
        },
        async deleteStatus(id) {
            try {
                await apiService.deleteAccountStatus(id);
                this.fetchAccountStatuses();
            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.fetchAccountStatuses();
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>
