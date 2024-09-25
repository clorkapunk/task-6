import React, {useEffect, useState} from 'react';
import {Liveblocks, RoomData} from "@liveblocks/node";
import {Spinner} from "@/components/ui/spinner";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from 'react-hot-toast';
import {useUserStore} from "@/stores/user-store";
import Image from 'next/image'


type Props = {}

const liveblocks = new Liveblocks({
    secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!
})

const RoomSelection = ({}: Props) => {


    const enterRoom = useUserStore((store) => store.enterRoom)
    const createRoom = useUserStore((store) => store.createRoom)
    const deleteRoom = useUserStore((store) => store.deleteRoom)
    const rooms = useUserStore((store) => store.rooms)
    const getRooms = useUserStore((store) => store.getRooms)


    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [id, setId] = useState('')

    const validateRoomId = (): boolean => {
        return !rooms.find(i => i.id === id);
    }

    useEffect(() => {
        getRooms()
    }, [])


    return (
        <div className={'h-screen flex justify-center items-center'}>
            {
                isFetching ?
                    <Spinner className={'text-primary-grey-300 rounded-2xl'} size={'large'}/>
                    :
                    <div className={'flex flex-col items-center gap-5'}>
                        <h3 className={'text-2xl text-primary-grey-300'}>Select a room or create your own</h3>
                        <div className={'flex gap-2'}>
                            {
                                rooms.map(i => (
                                    <div
                                        onClick={() => enterRoom(i.id)}
                                        key={i.id}
                                        className={`
                                            relative border rounded w-[200px] h-[100px] flex justify-center items-center
                                            cursor-pointer text-primary-grey-300 bg-primary-grey-200 overflow-hidden
                                            hover:bg-primary-green hover:border-none hover:text-primary-black
                                         `}
                                    >
                                        <Button
                                            className={'absolute top-0 right-0 rounded-none hover:border border-red-500 px-2'}
                                            onClick={e => {
                                                e.stopPropagation()
                                                deleteRoom(i.id)
                                            }}
                                        >
                                            <Image
                                                style={{filter: 'invert(0.9)'}}
                                                className={'p-0'}
                                                height={20}
                                                width={20}
                                                src={'/assets/delete.svg'}
                                                alt={'delete'}
                                            />
                                        </Button>
                                        <p>{i.id}</p>
                                    </div>
                                ))
                            }
                            <div
                                className={`
                                        border rounded w-[200px] h-[100px] justify-between items-center
                                        cursor-pointer text-primary-grey-300 bg-primary-grey-200 flex flex-col
                                        p-2
                                     `}
                            >

                                <Input
                                    value={id}
                                    onChange={(e) => {
                                        setId(e.target.value)
                                    }}
                                    className={'text-primary-grey-300 border-none bg-transparent'}
                                    placeholder={'Write room name'}
                                />
                                <Button
                                    className={'text-primary-green border-2 border-primary-green hover:bg-primary-green hover:text-primary-black w-full'}
                                    onClick={() => {
                                        if (!validateRoomId()) {
                                            toast.error("Room ID already exists!")
                                            return;
                                        }
                                        createRoom(id)
                                    }}
                                >
                                    Create room
                                </Button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
};

export default RoomSelection;
