import React, { ReactNode } from "react"
import { Card, Col, Row } from "react-bootstrap"
import styled from "styled-components"
import { useMediaQuery } from "usehooks-ts"

const StyledCard = styled(Card)`
  flex-grow: 1;
  border-radius: 1rem;
  background: var(--bs-white);
  border: none;
`

export const HeaderTitle = styled.div.attrs({
  className: "text-capitalize"
})`
  display: flex;
  align-items: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: 0 5rem 5rem 0;
  background-color: var(--bs-red);
  height: 2.5rem;
  line-height: 2rem;
  padding: 0 2rem;
  width: fit-content;
  min-width: 15rem;
  margin-left: -1rem;
`

const BugContainer = styled(Col)`
  .header-bug {
    color: #12266f;
    font-size: 1rem;
    border-color: #12266f;
  }
`

export const Header = ({ title, bug }: { title: string; bug?: ReactNode }) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Row className="mt-4 align-items-start">
      <Col>
        <HeaderTitle>{title}</HeaderTitle>
      </Col>
      <BugContainer
        className={`col-auto mt-2 mb-3 ${
          isMobile ? "mx-4 mt-4 col-10" : "mx-5"
        }`}
      >
        {bug && bug}
      </BugContainer>
    </Row>
  )
}

export const StyledBody = styled(Card.Body).attrs({
  className: `mx-1 mx-md-3`
})``

const StyledFooter = styled(Card.Footer)`
  border-radius: 0 0 1rem 1rem;
`

type TitledSectionCardProps = {
  title?: string
  footer?: React.ReactElement
  bug?: React.ReactElement
  className?: string
  children: React.ReactNode
}

const TitledSectionCard = ({
  title,
  children,
  footer,
  bug,
  className
}: TitledSectionCardProps) => {
  return (
    <StyledCard className={className}>
      {title && <Header title={title} bug={bug} />}
      <div className={`h-100`}>{children}</div>
      {footer && (
        <Card.Footer
          style={{
            borderRadius: "0 0 1rem 1rem",
            background: "var(--bs-secondary)",
            justifySelf: "end"
          }}
        >
          {footer}
        </Card.Footer>
      )}
    </StyledCard>
  )
}

export default TitledSectionCard
