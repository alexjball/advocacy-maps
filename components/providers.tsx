import { SSRProvider as AriaSSRProvider } from "@react-aria/ssr"
import React from "react"
import { SSRProvider as BootstrapSSRProvider } from "react-bootstrap"
import { Provider as Auth } from "../components/auth"
import { Provider as Profile } from "./db/profile/service"
import { Provider as Firebase } from "./firebase"
import { LogRocketProvider as LogRocket } from "./logRocket"
import { Provider as Search } from "./search"
import { ServiceProvider } from "./service"
import { Provider as Redux } from "./store"
import { ContainerFC } from "./types"

const providers = [Firebase, Redux, Auth, Profile, Search, LogRocket]

export const Providers: ContainerFC = ({ children }) => (
  <AriaSSRProvider>
    <BootstrapSSRProvider>
      <ServiceProvider providers={providers}>{children}</ServiceProvider>
    </BootstrapSSRProvider>
  </AriaSSRProvider>
)
