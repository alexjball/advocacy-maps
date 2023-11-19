import BrowserEnvironment from "jest-environment-jsdom"
import type { EnvironmentContext } from "@jest/environment"
import type { JestEnvironmentConfig } from "@jest/environment"
import timers from "timers"

class IntegrationEnvironment extends BrowserEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    Object.assign(config.projectConfig.globals, {
      // https://github.com/firebase/firebase-js-sdk/issues/3096#issuecomment-637584185
      Uint32Array: Uint32Array,
      Uint8Array: Uint8Array,
      ArrayBuffer: ArrayBuffer,
      fetch: fetch,

      // These are required to run the admin sdk in a jsdom environment
      setImmediate: timers.setImmediate,
      setTimeout: timers.setTimeout,
      setInterval: timers.setInterval,
      clearImmediate: timers.clearImmediate,
      clearTimeout: timers.clearTimeout,
      clearInterval: timers.clearInterval,

      /** jsdom's Blob implementation does not work with firebase/storage.
       * firebase/storage *does* work with a fallback if Blob is not
       * available, so removing the global is a hack to get storage tests
       * working. We'll need a better solution when tests need to use Blobs.
       * */
      Blob: undefined
    })
    super(config, context)
  }

  async setup() {}

  async teardown() {}
}

export default IntegrationEnvironment
