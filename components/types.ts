import type React from "react"

export type ChildrenProps = { children?: React.ReactNode }
export type ClassNameProps = { className?: string }

export type FC<P = {}> = React.FC<P>
export type ContainerFC<P = {}> = FC<P & ChildrenProps>
export type StyledFC<P = {}> = FC<P & ChildrenProps & ClassNameProps>
