// api.js

import axios from 'axios';

const API_URL = 'http://localhost:3081/api/lookups'; // Replace with your backend API URL

export default {
  // Fetch all lookups
  async fetchLookups() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching lookups:', error);
      throw error; // Throw error to handle it in component
    }
  },

  // Add a new lookup
  async addLookup(newLookup) {
    try {
      const response = await axios.post(API_URL, newLookup);
      return response.data;
    } catch (error) {
      console.error('Error adding lookup:', error);
      throw error;
    }
  },

  // Update an existing lookup
  async updateLookup(id, updatedLookup) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedLookup);
      return response.data;
    } catch (error) {
      console.error('Error updating lookup:', error);
      throw error;
    }
  },

  // Delete a lookup
  async deleteLookup(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting lookup:', error);
      throw error;
    }
  }
};
