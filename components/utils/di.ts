/**
 * Caches dependencies and provides a destructure-friendly way to access
 * application dependencies.
 */
export class DiContainer {
  private container = new Map<string, any>()

  protected memoize<T>(key: string, provider: () => T): T {
    if (!this.container.has(key)) this.container.set(key, provider())

    return this.container.get(key)
  }
}
