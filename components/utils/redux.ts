import {
  createAction,
  createAsyncThunk,
  Dispatch,
  isRejected,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI
} from "@reduxjs/toolkit"
import type {
  AsyncThunkFulfilledActionCreator,
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  AsyncThunkPendingActionCreator,
  AsyncThunkRejectedActionCreator
} from "@reduxjs/toolkit/dist/createAsyncThunk"
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query"
import {
  BaseQueryApi,
  BaseQueryError,
  BaseQueryExtraOptions,
  QueryReturnValue
} from "@reduxjs/toolkit/dist/query/baseQueryTypes"
import { MaybePromise } from "@reduxjs/toolkit/dist/query/tsHelpers"

export type AsyncThunkActions<
  Returned,
  ThunkArg = void,
  ThunkApiConfig = {}
> = {
  pending: AsyncThunkPendingActionCreator<ThunkArg, ThunkApiConfig>
  rejected: AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig>
  fulfilled: AsyncThunkFulfilledActionCreator<
    Returned,
    ThunkArg,
    ThunkApiConfig
  >
  typePrefix: string
}

/**
 * Create dummy action creators suitable for matching async thunks. These allow
 * a slice to define async thunk types while implementing them outside the
 * slice. The actions will throw if dispatched.
 */
export function declareThunk<Returned = undefined, ThunkArg = void>(
  typePrefix: string
): AsyncThunkActions<Returned, ThunkArg> {
  return {
    pending: createActionMatcher(typePrefix, "pending"),
    fulfilled: createActionMatcher(typePrefix, "fulfilled"),
    rejected: createActionMatcher(typePrefix, "rejected"),
    typePrefix
  }
}

function createActionMatcher(typePrefix: string, suffix: string): any {
  return createAction(typePrefix + "/" + suffix, () => {
    throw Error("Do not dispatch. Should only be used for matching.")
  })
}

/**
 * Log a warning for all rejected actions
 */
export const rejectionLogger: Middleware =
  (api: MiddlewareAPI) => next => action => {
    if (isRejectedWithValue(action) || isRejected(action)) {
      console.log("Async error!", action, action.error.stack)
    }
    return next(action)
  }

/** App-typed version of the Thunk API */
export type AsyncThunkConfig<
  RootState,
  AppDispatch extends Dispatch,
  ExtraThunkArgument
> = {
  state: RootState
  dispatch: AppDispatch
  extra: ExtraThunkArgument
}

/** Applies app types to `createAsyncThunk`, and allows passing a predeclared
 * thunk created by `declareThunk`.*/
export const createCreateAppThunk =
  <RootState, AppDispatch extends Dispatch, ExtraThunkArgument>() =>
  <Returned, ThunkArg = void>(
    typeOrActions: string | AsyncThunkActions<Returned, any>,
    payloadCreator: AsyncThunkPayloadCreator<
      Returned,
      ThunkArg,
      AsyncThunkConfig<RootState, AppDispatch, ExtraThunkArgument>
    >,
    options?: AsyncThunkOptions<
      ThunkArg,
      AsyncThunkConfig<RootState, AppDispatch, ExtraThunkArgument>
    >
  ) =>
    createAsyncThunk<
      Returned,
      ThunkArg,
      AsyncThunkConfig<RootState, AppDispatch, ExtraThunkArgument>
    >(
      typeof typeOrActions === "string"
        ? typeOrActions
        : typeOrActions.typePrefix,
      payloadCreator,
      options
    )

type QueryFn<QueryArg, BaseQuery extends BaseQueryFn, ResultType> = (
  arg: QueryArg,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions<BaseQuery>,
  baseQuery: (arg: Parameters<BaseQuery>[0]) => ReturnType<BaseQuery>
) => MaybePromise<QueryReturnValue<ResultType, BaseQueryError<BaseQuery>>>

interface AppQueryApi<Dependencies> extends BaseQueryApi {
  deps: Dependencies
}

type AppQueryFn<
  QueryArg,
  BaseQuery extends BaseQueryFn,
  ResultType,
  Dependencies
> = (
  arg: QueryArg,
  api: AppQueryApi<Dependencies>
) => MaybePromise<QueryReturnValue<ResultType, BaseQueryError<BaseQuery>>>

export const createAppQueryFnFactory =
  <Dependencies>() =>
  <QueryArg, BaseQuery extends BaseQueryFn, ResultType>(
    fn: AppQueryFn<QueryArg, BaseQuery, ResultType, Dependencies>
  ): QueryFn<QueryArg, BaseQuery, ResultType> =>
  (args, api) => {
    const deps = api.extra as Dependencies
    return fn(args, { ...api, deps })
  }
