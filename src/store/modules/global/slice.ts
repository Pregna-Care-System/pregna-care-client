import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from './state'

const editorSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoginStatus(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload
    }
  }
})

export const { setLoginStatus } = editorSlice.actions

export default editorSlice.reducer
