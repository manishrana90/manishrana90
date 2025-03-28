import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable SerializableStateInvariantMiddleware
      immutableCheck: false, // Disables ImmutableStateInvariantMiddleware
    }),
});

export default store;