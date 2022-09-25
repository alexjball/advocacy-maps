import { Container } from "react-bootstrap"
import CommunicatingWithLegislators from "../../components/CommunicatingWithLegislators/CommunicatingWithLegislators"
import { createPage } from "../../components/page"

export default createPage({
  title: "How To Have Impact Through Legislative Testimony",
  Page: () => {
    return (
      <Container>
        <CommunicatingWithLegislators />
      </Container>
    )
  }
})
