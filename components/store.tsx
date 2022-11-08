import { configureStore, isPlain } from "@reduxjs/toolkit"
import { Timestamp } from "firebase/firestore"
import React, { useRef } from "react"
import { Provider as ReduxProvider } from "react-redux"
import { reducer as auth } from "./auth/redux"
import { appApi } from "./db/appApi"
import { reducer as profile } from "./db/profile/redux"
import { Dependencies } from "./dependencies"
import { reducer as publish } from "./publish/redux"
import { rejectionLogger } from "./utils"

export const createStore = () =>
  configureStore({
    middleware: getDefaultMiddleware => {
      const middleware = getDefaultMiddleware({
        thunk: {
          extraArgument: new Dependencies()
        },
        serializableCheck: {
          isSerializable: (value: any) =>
            isPlain(value) ||
            (typeof value === "object" && value instanceof Timestamp),
          ignoredPaths: ["auth.user", "publish.service"],
          ignoredActions: ["auth/authChanged", "publish/bindService"]
        }
      })
        .concat(appApi.middleware)
        .concat(rejectionLogger)
      return middleware
    },
    reducer: {
      publish,
      auth,
      profile,
      [appApi.reducerPath]: appApi.reducer
    }
  })

export const Provider: React.FC<{}> = ({ children }) => {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) storeRef.current = createStore()
  return <ReduxProvider store={storeRef.current}>{children}</ReduxProvider>
}

// https://redux-toolkit.js.org/tutorials/typescript
//
// Import these with `import type ...` to ensure that the store dependency is erased.
export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
export type ExtraThunkArgument = Dependencies
