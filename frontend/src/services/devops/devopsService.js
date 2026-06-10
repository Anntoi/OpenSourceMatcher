import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://opensourcematcher.onrender.com/api/v1';

const devopsService = {
  // Dashboard
  getDashboard: async () => {
    try {
      const response = await axios.get(`${API_BASE}/devops/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },

  // Health
  getHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE}/devops/health`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching health:', error);
      throw error;
    }
  },

  // Pipelines
  getPipelines: async (limit = 20) => {
    try {
      const response = await axios.get(`${API_BASE}/devops/pipelines`, {
        params: { limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      throw error;
    }
  },

  // Deployments
  getDeployments: async (limit = 20) => {
    try {
      const response = await axios.get(`${API_BASE}/devops/deployments`, {
        params: { limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching deployments:', error);
      throw error;
    }
  },

  // Monitoring
  getMonitoring: async () => {
    try {
      const response = await axios.get(`${API_BASE}/devops/monitoring`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monitoring:', error);
      throw error;
    }
  },
};

export default devopsService;
