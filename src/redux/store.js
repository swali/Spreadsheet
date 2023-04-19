import { configureStore } from '@reduxjs/toolkit';
import gridReducer from './grid';
import { enableMapSet } from 'immer';

enableMapSet();

export default configureStore({
  reducer: {
    grid: gridReducer
  }
});
