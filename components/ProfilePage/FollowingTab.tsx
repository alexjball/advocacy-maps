import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  getDocs
} from "firebase/firestore"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import styled from "styled-components"
import { useAuth } from "../auth"
import { Col, Image, Row, Spinner, Stack } from "../bootstrap"
import { Profile, usePublicProfile, usePublishedTestimonyListing } from "../db"
import { firestore } from "../firebase"
import { formatBillId } from "../formatting"
import { External } from "../links"
import { TitledSectionCard } from "../shared"
import BillFollowingTitle from "./BillFollowingTitle"
import {
  Header,
  ProfileDisplayName,
  UserIcon,
  VerifiedBadge
} from "./StyledEditProfileCompnents"
import UnfollowModal from "./UnfollowModal"

type Props = {
  className?: string
}

export const Styled = styled.div`
  font-size: 2rem;
  a {
    display: inline-flex;
    align-items: baseline;

    font-family: "Nunito";
    font-style: normal;
    font-weight: 600;
    font-size: 25px;
    line-height: 125%;

    text-decoration-line: underline;
  }
  svg {
    max-height: 2rem;
    max-height: 2rem;
  }
`

export const OrgIcon = styled(Image).attrs(props => ({
  alt: "",
  src: props.src || "/profile-icon.svg",
  className: props.className
}))`
  height: 3rem;
  width: 3rem;
  margin: 1rem;
  border-radius: 50%;
  background-color: var(--bs-blue);
  flex: 0;
`

export function FollowingTab({ className }: Props) {
  const { user } = useAuth()
  const uid = user?.uid
  const subscriptionRef = collection(
    firestore,
    `/users/${uid}/activeTopicSubcriptions/`
  )
  let billList: string[] = []
  let orgsList: string[] = []
  const [billsFollowing, setBillsFollowing] = useState<string[]>([])
  const [orgsFollowing, setOrgsFollowing] = useState<string[]>([])

  const [currentCourt, setCurrentCourt] = useState<number>(0)
  const [currentOrgName, setCurrentOrgName] = useState<string>("")
  const [currentType, setCurrentType] = useState<string>("")
  const [currentTypeId, setCurrentTypeId] = useState<string>("")

  const [unfollowModal, setUnfollowModal] = useState<"show" | null>(null)

  const close = () => setUnfollowModal(null)

  const handleUnfollowClick = async (
    courtId: number,
    type: string,
    typeId: string
  ) => {
    let topicName = ""
    if (type == "bill") {
      topicName = "bill-".concat(courtId.toString()).concat("-").concat(typeId)
    } else {
      topicName = "org-".concat(typeId)
    }

    await deleteDoc(doc(subscriptionRef, topicName))

    setBillsFollowing([])
    setOrgsFollowing([])
    setUnfollowModal(null)
  }

  const billsFollowingQuery = async () => {
    const q = query(
      subscriptionRef,
      where("uid", "==", `${uid}`),
      where("type", "==", "bill")
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      billList.push(doc.data().billLookup)
    })

    if (billsFollowing.length === 0 && billList.length != 0) {
      setBillsFollowing(billList)
    }
  }

  useEffect(() => {
    uid ? billsFollowingQuery() : null
  })

  const orgsFollowingQuery = async () => {
    const q = query(
      subscriptionRef,
      where("uid", "==", `${uid}`),
      where("type", "==", "org")
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      orgsList.push(doc.data().orgId)
    })

    if (orgsFollowing.length === 0 && orgsList.length != 0) {
      setOrgsFollowing(orgsList)
    }
  }

  useEffect(() => {
    uid ? orgsFollowingQuery() : null
  })

  console.log("Bills Following: ", billsFollowing)
  console.log("Orgs Following: ", orgsFollowing)

  return (
    <>
      <TitledSectionCard className={className}>
        <div className={`mx-4 mt-3 d-flex flex-column gap-3`}>
          <Stack>
            <h2>Bills You Follow</h2>
            {billsFollowing.map((element: any, index: number) => (
              <Styled key={index}>
                <External
                  href={`https://malegislature.gov/Bills/${element?.court}/${element?.billId}`}
                >
                  {formatBillId(element?.billId)}
                </External>
                <Row>
                  <Col className={`col-10`}>
                    <BillFollowingTitle
                      court={element?.court}
                      id={element?.billId}
                    />
                  </Col>
                  <Col
                    className={`text-center`}
                    onClick={() => {
                      setCurrentCourt(element?.court)
                      setCurrentOrgName("")
                      setCurrentType("bill")
                      setCurrentTypeId(element?.billId)
                      setUnfollowModal("show")
                    }}
                  >
                    <button
                      className={`btn btn-link d-flex align-items-start p-0 text-decoration-none`}
                    >
                      <h6>Unfollow</h6>
                    </button>
                  </Col>
                  <hr className={`mt-3`} />
                </Row>
              </Styled>
            ))}
          </Stack>
        </div>
      </TitledSectionCard>
      <TitledSectionCard className={`${className}`}>
        <div className={`mx-4 mt-3 d-flex flex-column gap-3`}>
          <Stack>
            <h2>Organizations You Follow</h2>
            {orgsFollowing.map((orgId: string, index: number) => (
              <FollowedOrg
                key={index}
                orgId={orgId}
                setCurrentCourt={setCurrentCourt}
                setCurrentOrgName={setCurrentOrgName}
                setCurrentType={setCurrentType}
                setCurrentTypeId={setCurrentTypeId}
                setUnfollowModal={setUnfollowModal}
              />
            ))}
          </Stack>
        </div>
      </TitledSectionCard>
      <UnfollowModal
        currentCourt={currentCourt}
        currentOrgName={currentOrgName}
        currentType={currentType}
        currentTypeId={currentTypeId}
        handleUnfollowClick={handleUnfollowClick}
        onHide={close}
        onUnfollowModalClose={() => setUnfollowModal(null)}
        show={unfollowModal === "show"}
      />
    </>
  )
}

export function FollowedOrg({
  key,
  orgId,
  setCurrentCourt,
  setCurrentOrgName,
  setCurrentType,
  setCurrentTypeId,
  setUnfollowModal
}: {
  key: number
  orgId: string
  setCurrentCourt: Dispatch<SetStateAction<number>>
  setCurrentOrgName: Dispatch<SetStateAction<string>>
  setCurrentType: Dispatch<SetStateAction<string>>
  setCurrentTypeId: Dispatch<SetStateAction<string>>
  setUnfollowModal: Dispatch<SetStateAction<"show" | null>>
}) {
  const { result: profile, loading } = usePublicProfile(orgId)

  let displayName = ""
  if (profile?.displayName) {
    displayName = profile.displayName
  }

  console.log("Pro: ", profile)

  return (
    <>
      {loading ? (
        <Row>
          <Spinner animation="border" className="mx-auto" />
        </Row>
      ) : (
        <Row key={key}>
          <Col xs={"auto"} className={"col-auto"}>
            <OrgIcon
              className={`col d-none d-sm-flex`}
              src={profile?.profileImage}
            />
          </Col>
          <Col>{displayName}</Col>
          <Col
            className={`text-center`}
            onClick={() => {
              setCurrentCourt(0)
              setCurrentOrgName(displayName)
              setCurrentType("org")
              setCurrentTypeId(orgId)
              setUnfollowModal("show")
            }}
          >
            <button
              className={`btn btn-link d-flex align-items-start p-0 text-decoration-none`}
            >
              <h6>Unfollow</h6>
            </button>
          </Col>
          <hr className={`mt-3`} />
        </Row>
      )}
    </>
  )
}
