import { ChangeEvent, useCallback } from "react"
import { Image, Spinner } from "react-bootstrap"
import { useAuth } from "../auth"
import { useProfile } from "../db"

export type ImageInputProps = {
  className?: string
}

export const ImageInput = ({ className }: ImageInputProps) => {
  const { user } = useAuth()
  const uid = user?.uid
  const { updatingProfileImage, updateProfileImage, profile } = useProfile()

  const profileImage = profile?.profileImage

  const onChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files !== null) {
        const file = files[0]
        await updateProfileImage(file)
      }
    },
    [updateProfileImage]
  )

  return (
    <div className="d-flex flex-row px-3 col">
      <Image
        className={className}
        style={{
          objectFit: "contain",
          height: "10rem",
          width: "10rem",
          borderRadius: "2rem",
          margin: "1rem"
        }}
        alt="Profile image"
        src={profileImage}
      ></Image>
      {updatingProfileImage && <Spinner animation="border" />}
      <div className="d-flex flex-column justify-content-center align-items-start col mx-3">
        <input
          id="profileimage"
          className={`bg-white d-block`}
          type="file"
          accept="image/png, image/jpg"
          onChange={onChange}
        />
      </div>
    </div>
  )
}
