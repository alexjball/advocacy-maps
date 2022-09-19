import { GetServerSideProps } from "next/types"
import { createPage } from "../components/page"

type Props = { route: string }

export default createPage({
  title: "Learn",
  Page: props => {
    const { route } = props as Props

    return <div>This is route {route}</div>
  }
})

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const route = params?.slug
  return { props: { route: typeof route === "string" ? route : "unknown" } }
}
