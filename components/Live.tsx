import LiveCursors from "@/components/cursor/LiveCursors";
import {useMyPresence, useOthers} from "@/liveblocks.config";
import React, {useCallback, useEffect, useState} from "react";
import CursorChat from "@/components/cursor/CursorChat";
import {CursorMode, CursorState} from "@/types/type";

const Live = () => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any;

    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden
    })

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault();
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({cursor: {x, y}})
    }, [])

    const handlePointerLeave = useCallback(() => {
        setCursorState({mode: CursorMode.Hidden})
        updateMyPresence({cursor: null, message: null})
    }, [])

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({cursor: {x, y}})
    }, [])

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if(e.key === "/"){
                document.body.style.cursor = 'none'
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                })
            }
            else if(e.key === 'Escape'){
                document.body.style.cursor = 'auto'
                updateMyPresence({message: ''})
                setCursorState({mode: CursorMode.Hidden})
            }
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if(e.key === "/"){
                e.preventDefault();
            }
        }

        window.addEventListener('keyup', onKeyUp)
        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keyup', onKeyUp)
            window.removeEventListener('keydown', onKeyDown)
        }

    }, [updateMyPresence])

    return (
        <div
            style={{cursor: cursorState.mode === CursorMode.Chat ? 'none' : 'auto'}}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            className={'absolute top-0 left-0 h-[100vh] w-full flex justify-center items-center'}
        >
            {
                cursor &&
                <CursorChat
                    cursor={cursor}
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence}
                />
            }
            <LiveCursors others={others}/>
        </div>
    );
};

export default Live;
