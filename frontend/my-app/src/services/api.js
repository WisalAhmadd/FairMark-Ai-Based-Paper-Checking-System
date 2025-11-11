const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  gradePaper: async (file, subject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);

    const response = await fetch(`${API_URL}/grade`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to grade paper');
    return response.json();
  },

  searchStudents: async (query) => {
    const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  getHistory: async () => {
    const response = await fetch(`${API_URL}/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  getResult: async (id) => {
    const response = await fetch(`${API_URL}/result/${id}`);
    if (!response.ok) throw new Error('Failed to fetch result');
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
};