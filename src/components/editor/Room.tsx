"use client"
import {ReactNode,useMemo} from 'react'
import {RoomProvider, useRoom } from '@liveblocks/react/suspense'
import {ClientSideSuspense} from "@liveblocks/react"

const Room = ({children,Roomid}:{
    children:ReactNode,
    Roomid:string
}) => {

  return (
    <RoomProvider
    id={Roomid}
    initialPresence={{
        cursor:null
    }}
    >
     <ClientSideSuspense fallback={<p>Loading ..</p>}>
        {children}    
    </ClientSideSuspense>   
    </RoomProvider>
  )
}

export default Room