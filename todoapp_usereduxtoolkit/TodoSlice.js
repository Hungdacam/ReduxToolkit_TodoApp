// Import required modules from Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'https://6454008bc18adbbdfead590d.mockapi.io/api/v1/api_todolist';

// Thunks for async actions
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get(URL);
  return response.data;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (title) => {
  const response = await axios.post(URL, { title });
  return response.data;
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, title }) => {
  const response = await axios.put(`${URL}/${id}`, { title });
  return response.data;
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  await axios.delete(`${URL}/${id}`);
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
