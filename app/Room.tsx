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
import LoginForm from "@/components/LoginForm";
import RoomSelection from "@/components/RoomSelection";
import {Spinner} from "@/components/ui/spinner";
import {useUserStore} from "@/stores/user-store";


export function Room({children}: { children: ReactNode }) {


    const [isFetching, setIsFetching] = useState(true);
    const isAuth = useUserStore((store) => store.isAuth)
    const isRoomSelected = useUserStore((store) => store.isRoomSelected)
    const setUsername = useUserStore((store) => store.setUsername)
    const enterRoom = useUserStore((store) => store.enterRoom)
    const roomId = useUserStore((store) => store.roomId)
    const username = useUserStore((store) => store.username)
    const auth = useUserStore((store) => store.auth )



    useEffect(() => {
        enterRoom(sessionStorage.getItem('room-id'))
        setUsername(sessionStorage.getItem("username"))
        setIsFetching(false)
    }, [])

    useEffect(() => {
        if(isRoomSelected && isAuth){
            // auth(true)
        }
    }, []);

    if (isFetching) {
        return <div className={'h-screen flex justify-center items-center'}>
            <Spinner className={'text-primary-grey-300 rounded-2xl'} size={'large'}/>
        </div>
    }

    if (!isAuth) {
        return <LoginForm/>
    }

    if (!isRoomSelected) {
        return <RoomSelection/>
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks


    // async function auth() {
    //     const headers = {
    //         "Content-Type": "application/json",
    //     };
    //
    //     const body = JSON.stringify({
    //         roomId,
    //         userId: username
    //     });
    //
    //     const response = await fetch("/api/liveblocks-auth", {
    //         method: "POST",
    //         headers,
    //         body,
    //     });
    //
    //     const data = await response.json()
    //
    //     return data
    // }


    return (
        <>
            <LiveblocksProvider
                authEndpoint={() => auth(false)}
            >
                <RoomProvider
                    id={roomId}
                    initialPresence={{
                        name: username,
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
