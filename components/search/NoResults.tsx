import { ContainerFC } from "components/types"
import { Image } from "react-bootstrap"
import styled from "styled-components"

const Container = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 3rem 1.5rem 3rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 6rem;
  }
`

export const NoResults: ContainerFC = ({ children }) => {
  return (
    <Container>
      <Image src="/no-results.png" alt="No results" />
      <div className="fs-3">Looks Pretty Empty Here</div>
      <div className="text-center">{children}</div>
    </Container>
  )
}
