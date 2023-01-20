import { z } from "zod"
import { cloneDeep } from "lodash"

export const FeatureFlags = z.object({
  testimonyDiffing: z.boolean(),
  formatBillTextAsMarkdown: z.boolean()
})
export type FeatureFlags = z.output<typeof FeatureFlags>

const baseDefaults: FeatureFlags = {
  testimonyDiffing: false,
  formatBillTextAsMarkdown: false
}

const defaults: Record<typeof process.env.NODE_ENV, FeatureFlags> = {
  development: {
    ...cloneDeep(baseDefaults)
  },
  production: {
    ...cloneDeep(baseDefaults)
  },
  test: {
    ...cloneDeep(baseDefaults)
  }
}

const values = FeatureFlags.parse(defaults[process.env.NODE_ENV])

// Add a function call of indirection to allow reloading values in the future
export const flags = () => values
