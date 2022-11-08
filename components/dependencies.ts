import { createClient } from "./search/common"
import { DiContainer } from "./utils"

// TOOD: how to inject things with async intializers?
export class Dependencies extends DiContainer {
  get typesenseClient() {
    return this.memoize("typesenseClient", createClient)
  }
}
