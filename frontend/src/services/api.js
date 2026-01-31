/**
 * API service – backend communication via axios.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getTasks() {
  const { data } = await api.get('/tasks');
  return data;
}

export async function createTask(task) {
  const { data } = await api.post('/tasks', task);
  return data;
}

export async function updateTask(id, task) {
  const { data } = await api.put(`/tasks/${id}`, task);
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}
