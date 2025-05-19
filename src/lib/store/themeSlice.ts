
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

interface ThemeState {
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload === 'dark';
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const selectIsDarkMode = (state: RootState) => state.theme.isDarkMode;

export default themeSlice.reducer;
