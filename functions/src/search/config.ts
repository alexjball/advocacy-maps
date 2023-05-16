import { Query } from "@google-cloud/firestore"
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections"
import { DocumentData } from "../firebase"

export type BaseRecord = { id: string }
export type Schema = Omit<CollectionCreateSchema, "name">
export type CollectionConfig<T extends BaseRecord = BaseRecord> = {
  readonly alias: string
  readonly schema: Schema
  readonly sourceCollection: Query
  readonly documentTrigger: string
  readonly idField: string
  readonly convert: (data: DocumentData) => T
}

const registered: CollectionConfig[] = []
export const registerConfig = (config: CollectionConfig) => {
  registered.push(config)
}
export const getRegisteredConfigs = () => registered

export const isTypesenseConfigured = () =>
  Boolean(process.env.TYPESENSE_API_URL)
