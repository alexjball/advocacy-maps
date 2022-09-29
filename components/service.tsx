import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { ContainerFC } from "./types"

type Maybe<T> = T | undefined
type Setter<T> = (s: T) => void

/** Creates a service context and access hooks. */
export function createService<Service>(providerHook?: () => Service): {
  Provider: ContainerFC
  useService: () => Maybe<Service>
  useServiceChecked: () => Service
  useBinding: (impl: Service) => void
} {
  const Context = createContext<{
    value: Maybe<Service>
    setValue: Setter<Maybe<Service>>
  }>({
    value: undefined,
    setValue() {
      throw Error("No provider found")
    }
  })

  return {
    Provider({ children }) {
      const providerValue = providerHook?.()
      const [value, setValue] = useState<Maybe<Service>>(undefined)

      return (
        <Context.Provider
          value={useMemo(
            () => ({ value: providerValue ?? value, setValue }),
            [providerValue, value]
          )}
        >
          {children}
        </Context.Provider>
      )
    },

    useBinding(impl: Service) {
      const { setValue } = useContext(Context)
      useEffect(() => {
        setValue(impl)
        return () => setValue(undefined)
      }, [impl, setValue])
    },

    useService() {
      return useContext(Context).value
    },

    useServiceChecked() {
      const service = useContext(Context).value
      if (!service)
        throw Error("No service found. Check for a Provider and/or useBinding.")
      return service
    }
  }
}

type BaseProvider = ContainerFC

/** Render a list of service providers */
export const ServiceProvider: ContainerFC<{
  providers: BaseProvider[]
}> = ({ providers, children }) => (
  <>
    {providers.reduceRight(
      (children, Provider) => (
        <Provider>{children}</Provider>
      ),
      children
    )}
  </>
)
