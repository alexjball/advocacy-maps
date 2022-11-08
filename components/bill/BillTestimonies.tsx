import { useDisplayPublishedTestimony } from "components/db"
import { appApi as api, BillContent } from "../db"
import ViewTestimony from "../UserTestimonies/ViewTestimony"

export const BillTestimonies = (props: {
  bill: BillContent
  className?: string
}) => {
  const testimony = useDisplayPublishedTestimony({
    billId: props.bill.BillNumber
  })
  const rtkTestimony = api.useListPublishedTestimonyForBillQuery({
    billId: props.bill.BillNumber
  })
  console.log(rtkTestimony)
  return (
    <>
      <ViewTestimony
        {...testimony}
        showControls={false}
        className={props.className}
      />
    </>
  )
}
