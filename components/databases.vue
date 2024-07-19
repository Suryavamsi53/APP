<template>
    <div>
      <!-- Navbar -->
      <nav class="navbar">
        <div class="container">
          <button class="show-table-button" @click="toggleCrudButtons">
            Lookup Table
          </button>
          <button class="show-table-button" @click="toggleAccountStatusTable">
            Account Status Table
          </button>
          <button class="show-table-button" @click="toggleAddressTable">
            Address Table
          </button>
          <button class="show-table-button" @click="toggleAccountTypeTable">
            Account Type Table
    </button>
          
    
    

        <!-- CRUD Operation Buttons -->
        <div v-if="showCrudButtons" class="crud-buttons">
          <button class="crud-button" @click="toggleForm('add')">Add Data</button>
          <button class="crud-button" @click="toggleForm('delete')">Delete Data</button>
          <button class="crud-button" @click="toggleTable">Display</button>
        </div>
      </div>
    </nav>
  
      <!-- Content Area -->
      <div class="content">
        <!-- Error message display -->
        <h3 v-if="errorMsg" class="error-message">{{ errorMsg }}</h3>
  
        <!-- Data Table -->
        <div class="data-container" v-if="showTable">
          <table class="data-table">
            <thead>
              <tr>
                <th>Lookup Id</th>
                <th>Lookup Code</th>
                <th>Lookup Type</th>
                <th>Lookup Desc</th>
                <th>Is Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lookup in paginatedLookups" :key="lookup.Lookup_Id">
                <td>{{ lookup.Lookup_Id }}</td>
                <td>{{ lookup.Lookup_Code }}</td>
                <td>{{ lookup.Lookup_Type }}</td>
                <td>{{ lookup.Lookup_Desc }}</td>
                <td>{{ lookup.Is_Active }}</td>
                <td>
                  <button @click="editLookup(lookup)">Edit</button>
                  <button @click="deleteLookup(lookup.Lookup_Id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination" v-if="lookups.length > pageSize">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
          </div>
        </div>
  
        <!-- Add Lookup Form -->
        <div class="add-form" v-if="showAddForm">
          <h2>Add New Lookup</h2>
          <form @submit.prevent="addLookup">
            <input v-model="newLookup.Lookup_Id" placeholder="Lookup ID">
            <input v-model="newLookup.Lookup_Code" placeholder="Lookup Code">
            <input v-model="newLookup.Lookup_Type" placeholder="Lookup Type">
            <input v-model="newLookup.Lookup_Desc" placeholder="Lookup Description">
            <input v-model="newLookup.Is_Active" placeholder="Is Active">
            <button type="submit">Add</button>
            <button type="button" @click="cancelAdd">Cancel</button>
          </form>
        </div>
  
        <!-- Update Lookup Form -->
        <div class="update-form" v-if="showUpdateForm">
          <h2>Update Lookup</h2>
          <form @submit.prevent="updateLookup">
            <input v-model="newLookup.Lookup_Id" placeholder="Lookup ID">
            <input v-model="newLookup.Lookup_Code" placeholder="Lookup Code">
            <input v-model="newLookup.Lookup_Type" placeholder="Lookup Type">
            <input v-model="newLookup.Lookup_Desc" placeholder="Lookup Description">
            <input v-model="newLookup.Is_Active" placeholder="Is Active">
            <button type="submit">Update</button>
            <button type="button" @click="cancelUpdate">Cancel</button>
          </form>
        </div>
  
        <!-- Delete Lookup Form -->
        <div class="delete-form" v-if="showDeleteForm">
          <h2>Delete Lookup</h2>
          <form @submit.prevent="deleteLookupById">
            <input v-model="currentLookupId" placeholder="Enter Lookup ID to Delete">
            <button type="submit">Delete</button>
            <button type="button" @click="cancelDelete">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  const API_URL = 'http://localhost:3012/lookups'; // Replace with your backend API URL
  
  export default {
    name: 'LookupList',
    data() {
      return {
        lookups: [],
        currentPage: 1,
        pageSize: 5,
        errorMsg: '',
        newLookup: {
          Lookup_Id: null,
          Lookup_Code: null,
          Lookup_Type: '',
          Lookup_Desc: '',
          Is_Active: ''
        },
        currentLookupId: '',
        showAddForm: false,
        showUpdateForm: false,
        showDeleteForm: false,
        showEditForm: false,
        showTable: true,
        showCrudButtons: true
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.lookups.length / this.pageSize);
      },
      paginatedLookups() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.lookups.slice(startIndex, startIndex + this.pageSize);
      }
    },
    async created() {
      await this.fetchLookups();
    },
    methods: {
      toggleTable() {
        this.showTable = !this.showTable;
      },
      toggleCrudButtons() {
        this.showCrudButtons = !this.showCrudButtons;
      },
      toggleForm(formType) {
        this.showAddForm = formType === 'add';
        this.showUpdateForm = formType === 'update';
        this.showDeleteForm = formType === 'delete';
        this.showEditForm = formType === 'edit';
      },
      toggleAccountStatusTable() {
        console.log('Toggling Account Status Table');
        // Add your logic for displaying the Account Status Table here
      },
      toggleAddressTable() {
        console.log('Toggling Address Table');
        // Add your logic for displaying the Address Table here
      },
      toggleAccountTypeTable() {
        console.log('Toggling Account Type Table');
        // Add your logic for displaying the Account Type Table here
      },
      async fetchLookups() {
        try {
          const response = await axios.get(API_URL);
          this.lookups = response.data;
        } catch (error) {
          console.error('Error fetching lookups:', error);
          this.errorMsg = 'Failed to fetch lookups. Please try again.';
        }
      },
      async addLookup() {
        axios.post('/api/lookups', this.newLookup)
          .then(response => {
            this.lookups.push(response.data);
            this.resetForm();
            this.showAddForm = false;
            this.errorMsg = ''; // Clear any previous error messages
          })
          .catch(error => {
            console.error('Error adding lookup:', error);
            this.errorMsg = 'Failed to add lookup. Please try again.';
          });
      },
      async updateLookup() {
        try {
          await axios.put(`${API_URL}/${this.newLookup.Lookup_Id}`, this.newLookup);
          this.fetchLookups();
          this.resetForm();
          this.currentLookupId = '';
          this.showUpdateForm = false;
        } catch (error) {
          console.error('Error updating lookup:', error);
          this.errorMsg = 'Failed to update lookup. Please try again.';
        }
      },
      async deleteLookup(id) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          this.fetchLookups();
          this.currentLookupId = '';
        } catch (error) {
          console.error('Error deleting lookup:', error);
          this.errorMsg = 'Failed to delete lookup. Please try again.';
        }
      },
      async editLookup(lookup) {
        this.newLookup = { ...lookup };
        this.currentLookupId = lookup.Lookup_Id;
        this.showUpdateForm = true;
      },
      async deleteLookupById() {
        try {
          await axios.delete(`${API_URL}/${this.currentLookupId}`);
          this.fetchLookups();
          this.currentLookupId = '';
          this.showDeleteForm = false;
        } catch (error) {
          console.error('Error deleting lookup:', error);
          this.errorMsg = 'Failed to delete lookup. Please try again.';
        }
      },
      async editLookupById() {
        try {
          const response = await axios.get(`${API_URL}/${this.currentLookupId}`);
          this.newLookup = response.data;
          this.showEditForm = false;
          this.showAddForm = true;
        } catch (error) {
          console.error('Error fetching lookup:', error);
          this.errorMsg = 'Failed to fetch lookup. Please try again.';
        }
      },
      cancelAdd() {
        this.resetForm();
        this.showAddForm = false;
      },
      cancelUpdate() {
        this.resetForm();
        this.showUpdateForm = false;
      },
      cancelDelete() {
        this.currentLookupId = '';
        this.showDeleteForm = false;
      },
      resetForm() {
        this.newLookup = {
          Lookup_Id: null,
          Lookup_Code: null,
          Lookup_Type: '',
          Lookup_Desc: '',
          Is_Active: ''
        };
        this.errorMsg = ''; // Clear any previous error messages
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    background-color: #333;
    color: white;
    padding: 1rem;
  }
  
  .show-table-button {
    background-color: #666;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    cursor: pointer;
  }
  
  .show-table-button:hover {
    background-color: #555;
  }
  
  .crud-buttons {
    margin-top: 1rem;
  }
  
  .crud-button {
    background-color: #888;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    cursor: pointer;
  }
  
  .crud-button:hover {
    background-color: #777;
  }
  
  .data-container {
    margin-top: 2rem;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th, .data-table td {
    border: 1px solid #ddd;
    padding: 0.5rem;
  }
  
  .pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .error-message {
    color: red;
  }
  
  .add-form, .update-form, .delete-form {
    margin-top: 2rem;
  }
  
  .add-form h2, .update-form h2, .delete-form h2 {
    margin-bottom: 1rem;
  }
  
  .add-form input, .update-form input, .delete-form input {
    display: block;
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  </style>
  