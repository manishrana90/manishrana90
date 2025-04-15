import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
<<<<<<< HEAD
=======
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable SerializableStateInvariantMiddleware
      immutableCheck: false, // Disables ImmutableStateInvariantMiddleware
    }),
>>>>>>> origin/main
});

export default store;