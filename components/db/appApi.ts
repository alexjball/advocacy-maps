import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react"
import type { Dependencies } from "components/dependencies"
import { SearchParams } from "typesense/lib/Typesense/Documents"
import { TestimonySearchRecord } from "./testimony"

const defaultPage = 1
const defaultPerPage = 10
type PaginatedQuery = { page?: number; perPage?: number }
type PaginatedResult<Result = unknown> = {
  results: Result[]
  page: number
  perPage: number
  totalResults: number
}

type ApiError = {
  name?: string
  message?: string
  stack?: string
  httpStatus?: number
}

const baseQueryStub: BaseQueryFn<unknown, unknown, ApiError, {}, {}> = () => {
  throw Error("Not implemented. Specify queryFn for each endpoint instead")
}

export const createAppApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryStub,
  tagTypes: ["Testimony"],
  endpoints: builder => {
    return {
      listTestimony: builder.query<
        PaginatedResult<TestimonySearchRecord>,
        (
          | { billId: string; authorUid?: never }
          | { billId?: never; authorUid: string }
        ) &
          PaginatedQuery
      >({
        providesTags: ["Testimony"],
        queryFn: async (
          { authorUid, billId, page = defaultPage, perPage = defaultPerPage },
          { extra }
        ) => {
          const { typesenseClient } = extra as Dependencies
          const params: SearchParams = {
            q: "*",
            query_by: "billId",
            page,
            per_page: perPage,
            filter_by: [
              billId && `billId:=${billId}`,
              authorUid && `authorUid:=${authorUid}`
            ]
              .filter(Boolean)
              .join("&&")
          }
          const res = await typesenseClient
            .collections<TestimonySearchRecord>("publishedTestimony")
            .documents()
            .search(params)

          return {
            data: {
              page,
              perPage,
              totalResults: res.found,
              results: res.hits?.map(d => d.document) ?? []
            }
          }
        }
      })
    }
  }
})
