import Router, { useRouter } from "next/router"
import { useEffect } from "react"
import { createService } from "./service"

export const { Provider } = createService(useLocalizedRoute)

/** Updates the Browser URL to include the locale. The default locale does not
 * have a prefix. */
function useLocalizedRoute() {
  const { locale, asPath } = useRouter()

  useEffect(() => {
    const firstSegment = window.location.pathname.split("/").filter(Boolean)[0]
    if (locale && firstSegment !== locale) {
      Router.replace(`/${locale}${asPath}`, undefined, { shallow: false })
    }
  }, [asPath, locale])
}
