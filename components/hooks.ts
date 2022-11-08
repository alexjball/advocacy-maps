import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore
} from "react-redux"
import { Dependencies } from "./dependencies"
import type {
  AppDispatch,
  AppStore,
  ExtraThunkArgument,
  RootState
} from "./store"
import { createAppQueryFnFactory, createCreateAppThunk } from "./utils"

// Provides correctly-typed functions for interacting with the redux store.

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = () => useStore()
export const createAppThunk = createCreateAppThunk<
  RootState,
  AppDispatch,
  ExtraThunkArgument
>()

export const appQueryFn = createAppQueryFnFactory<Dependencies>()
