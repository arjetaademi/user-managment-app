import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: "",
    loadedOnce: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.items.unshift(action.payload); 
    },
    deleteUser: (state, action) => {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
    updateUser: (state, action) => {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex((u) => u.id === id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...changes };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.loadedOnce = true;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Something went wrong";
      });
  },
});

export const { addUser, deleteUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;