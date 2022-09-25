import clsx from "clsx"
import type { RowProps } from "react-bootstrap"
import { Col, Row } from "react-bootstrap"
import styles from "./Divider.module.css"

export default function Divider({
  children,
  className,
  ...restProps
}: RowProps) {
  return (
    <Row {...restProps} className={clsx("text-secondary", className)}>
      <Col>
        <hr className={styles.line} />
      </Col>
      <Col className="col-auto fs-5">{children}</Col>
      <Col>
        <hr className={styles.line} />
      </Col>
    </Row>
  )
}
