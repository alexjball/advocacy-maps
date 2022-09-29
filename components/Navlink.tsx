import { useRouter } from "next/router"
import { Nav } from "react-bootstrap"
import * as links from "./links"
import { Wrap } from "./links"
import { StyledFC } from "./types"

export const NavLink: StyledFC<{
  href?: string
  handleClick?: any
  other?: any
}> = ({ href, handleClick, className, children, other }) => {
  const router = useRouter()
  return (
    <Wrap href={href ?? router.asPath}>
      <Nav.Link
        active={router.pathname === href}
        onClick={handleClick}
        className={className}
        {...other}
      >
        {children}
      </Nav.Link>
    </Wrap>
  )
}

export const ExternalNavLink: StyledFC<{
  href: string
}> = ({ href, children, className }) => {
  return (
    <links.External className={`${className} nav-link`} href={href}>
      {children}
    </links.External>
  )
}
