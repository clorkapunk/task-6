"use client";

import React, {ReactNode, useEffect, useState} from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import {LiveList, LiveMap, LiveObject} from "@liveblocks/client";
import Loader from "@/components/Loader";
import {CanvasPageData} from "@/types/type";
import InputForm from "@/components/InputForm";
import RoomSelection from "@/components/RoomSelection";
import {Spinner} from "@/components/ui/spinner";


export function Room({children}: { children: ReactNode }) {

    const [isFetching, setIsFetching] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false)
    const [name, setName] = useState('')

    const [isRoomSelected, setIsRoomSelected] = useState(false)
    const [id, setId] = useState('');

    useEffect(() => {
        if (window) {
            setIsRegistered(!!sessionStorage.getItem("username"))
            setIsRoomSelected(!!sessionStorage.getItem("room-id"))
            setName(sessionStorage.getItem("username") || '')
            setId(sessionStorage.getItem("room-id") || "")
            setIsFetching(false)
        }
    }, [])

    if (isFetching) {
        return <div className={'h-screen flex justify-center items-center'}>
            <Spinner className={'text-primary-grey-300 rounded-2xl'} size={'large'}/>
        </div>
    }

    if (!isRegistered) {
        return <InputForm
            label={'Write your username'}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            buttonLabel={'Continue'}
            value={name}
            onSubmit={() => {
                if (name === '') return
                sessionStorage.setItem('username', name)
                setIsRegistered(true)
            }}
        />
    }

    if (!isRoomSelected) {
        return <RoomSelection
            handleCreate={(roomId: string) => {
                setId(roomId)
                sessionStorage.setItem('room-id', roomId)
                setIsRoomSelected(true)
            }}
            handleSelect={(id: string) => {
                setId(id)
                sessionStorage.setItem('room-id', id)
                setIsRoomSelected(true)
            }}
        />
    }


    return (
        <>
            <LiveblocksProvider
                publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}>
                <RoomProvider
                    id={id}
                    initialPresence={{
                        name: name,
                        cursor: null,
                        cursorColor: null,
                        editingText: null,
                        page: 1
                    }}
                    initialStorage={{
                        canvasPages: new LiveList<LiveObject<CanvasPageData>>([
                            new LiveObject<{ pageNumber: number; data: LiveMap<string, any> }>({
                                pageNumber: 1,
                                data: new LiveMap<string, any>()
                            })
                        ])
                    }}
                >
                    <ClientSideSuspense fallback={<Loader/>}>
                        {children}
                    </ClientSideSuspense>
                </RoomProvider>
            </LiveblocksProvider>
        </>

    );
}
