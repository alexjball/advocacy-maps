import { runWith } from "firebase-functions"
import {
  BaseRecord,
  CollectionConfig,
  isTypesenseConfigured,
  registerConfig
} from "./config"
import { SearchIndexer } from "./SearchIndexer"

export function createSearchIndexer<T extends BaseRecord = BaseRecord>(
  config: CollectionConfig<T>
) {
  registerConfig(config)
  return {
    upgradeSearchIndex: runWith({
      timeoutSeconds: 240,
      secrets: ["TYPESENSE_API_KEY"]
    })
      .firestore.document(SearchIndexer.upgradePath(config.alias))
      .onCreate(async snap => {
        if (!isTypesenseConfigured()) return
        await new SearchIndexer(config).performUpgrade(snap.data())
      }),
    syncToSearchIndex: runWith({
      timeoutSeconds: 30,
      secrets: ["TYPESENSE_API_KEY"]
    })
      .firestore.document(config.documentTrigger)
      .onWrite(async change => {
        if (!isTypesenseConfigured()) return
        await new SearchIndexer(config).syncDocument(change)
      })
  }
}
