import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { Action, AnyAction, Middleware, ReducersMapObject } from 'redux';
import { combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistConfig } from 'redux-persist/lib/types';
import { Observable, catchError } from 'rxjs';

import { rootStateReducer } from '../root-state.reducers';

import { addFlipperDebugger } from './filpper.util';

export const createStore = <S, A extends Action = AnyAction>({
  reducers,
  epics
}: {
  reducers: ReducersMapObject<S, A>;
  epics: Epic[];
}) => {
  const epicMiddleware = createEpicMiddleware();
  const middlewares: Array<Middleware<string, S>> = addFlipperDebugger<S>([epicMiddleware]);

  const persistConfig: PersistConfig<S> = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2
  };

  const rootReducer = rootStateReducer<S, A>(reducers);

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootEpic = (action$: Observable<any>, store$: StateObservable<any>, dependencies: any) =>
    combineEpics(...epics)(action$, store$, dependencies).pipe(
      catchError((error, source) => {
        console.error(error);

        return source;
      })
    );

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }).concat(middlewares);
    }
  });

  const persistor = persistStore(store);

  epicMiddleware.run(rootEpic);

  return { store, persistor };
};