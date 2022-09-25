import { Col, Container, Row } from "react-bootstrap"
import AboutPagesCard from "../AboutPagesCard/AboutPagesCard"
import {
  OurGoalsCardContent,
  OurMissionCardContent
} from "../GoalsAndMissionCardContent/GoalsAndMissionCardContent"
import styles from "./GoalsAndMission.module.css"

const GoalsAndMission = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className={`fw-bold ${styles.header}`}>Our Goals and Mission</h1>
          <AboutPagesCard title="Our Goals">
            <OurGoalsCardContent />
          </AboutPagesCard>
          <AboutPagesCard title="Our Mission">
            <OurMissionCardContent />
          </AboutPagesCard>
        </Col>
      </Row>
    </Container>
  )
}

export default GoalsAndMission
