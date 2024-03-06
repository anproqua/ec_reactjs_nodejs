import { createSlice } from "@reduxjs/toolkit";

// Trong Redux Toolkit, thư viện Slice được sử dụng để tạo ra các "slice reducers", 
// là một phần của Redux, giúp quản lý trạng thái của ứng dụng. 
// Slice reducers là các phần của trạng thái ứng dụng mà bạn có thể tạo ra 
// bằng cách sử dụng một hàm tiện ích createSlice().


const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};
// Trong Redux, reducers là các hàm pure functions được sử dụng để quản lý và cập nhật state của ứng dụng. 
// Reducers nhận vào hai tham số: state hiện tại và một action mô tả việc cập nhật state. 

// Khi một action được dispatch, nó sẽ được chuyển tới reducer. 
// Reducer sẽ nhận action đó, và dựa vào loại của action đó, nó sẽ thực hiện các thay đổi cần thiết trên state.
export const userSlice = createSlice({
  initialState,
  name: "userSlice",
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setIsAuthenticated, setUser, setLoading } = userSlice.actions;

