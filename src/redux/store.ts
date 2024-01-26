import { configureStore } from '@reduxjs/toolkit'
import gridDataReducer from "../components/grid/gridDataSlice";

export const store = configureStore({
  reducer: {
    gridData: gridDataReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store