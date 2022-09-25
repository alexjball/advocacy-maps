import { Container } from "react-bootstrap"
import { createPage } from "../components/page"
import { BillSearch } from "../components/search"

export default createPage({
  title: "Browse Bills",
  Page: () => {
    return (
      <Container fluid="md" className="mt-3">
        <h1>All Bills</h1>
        <h3>Current session: 2021-2022</h3>
        <BillSearch />
      </Container>
    )
  }
})
