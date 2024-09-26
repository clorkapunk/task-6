import React, {useEffect, useState} from 'react';
import {Liveblocks, RoomData} from "@liveblocks/node";
import {Spinner} from "@/components/ui/spinner";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from 'react-hot-toast';
import {useUserStore} from "@/stores/user-store";
import Image from 'next/image'
import {Dam} from "lucide-react";


type Props = {}

const liveblocks = new Liveblocks({
    secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!
})

function calculateTimeDifference(givenDate: Date) {
    const now = new Date();

    // Преобразуем обе даты в миллисекунды для точного вычисления
    const givenDateTimestamp = givenDate.getTime();
    const nowTimestamp = now.getTime();

    // Вычисляем разницу в миллисекундах
    const timeDifferenceInMilliseconds = nowTimestamp - givenDateTimestamp;

    // Конвертируем разницу в различные единицы измерения
    const millisecondsInMinute = 60000;
    const millisecondsInHour = 3600000;
    const millisecondsInDay = 86400000;

    // Определяем, какую единицу измерения использовать
    let difference;
    if (timeDifferenceInMilliseconds < millisecondsInHour) {
        difference = Math.floor(timeDifferenceInMilliseconds / millisecondsInMinute);
        return `${difference} minutes ago`;
    } else if (timeDifferenceInMilliseconds < millisecondsInDay) {
        difference = Math.floor(timeDifferenceInMilliseconds / millisecondsInHour);
        return `${difference} hours ago`;
    } else {
        difference = Math.floor(timeDifferenceInMilliseconds / millisecondsInDay);
        return `${difference} days ago`;
    }
}

const RoomSelection = ({}: Props) => {


    const enterRoom = useUserStore((store) => store.enterRoom)
    const createRoom = useUserStore((store) => store.createRoom)
    const deleteRoom = useUserStore((store) => store.deleteRoom)
    const rooms = useUserStore((store) => store.rooms)
    const getRooms = useUserStore((store) => store.getRooms)
    const username = useUserStore((store) => store.username)


    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [id, setId] = useState('')

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

                        <div className={'flex flex-col gap-2 w-[700px]'}>
                            <div className={'flex'}>
                                <div className={'w-[30%] text-center text-primary-grey-300'}>
                                    Name
                                </div>
                                <div className={'w-[25%] text-center text-primary-grey-300'}>
                                    Creation date
                                </div>
                                <div className={'w-[25%] text-center text-primary-grey-300'}>
                                    Last connection
                                </div>
                                <div className={'w-[20%]'}>

                                </div>
                            </div>
                            {
                                rooms.map(room => (
                                    <div
                                        key={room.id}
                                        className={'flex items-stretch max-w-[700px] bg-primary-black p-2 rounded w-full'}
                                    >
                                        <div className={`
                                            w-[30%] border-r border-primary-grey-200 text-white flex 
                                            text-center justify-center items-center
                                        `}>
                                            <p>{room.id}</p>
                                        </div>
                                        <div className={`
                                            w-[25%] border-r border-primary-grey-200 text-white flex 
                                            text-center justify-center items-center
                                        `}>
                                            <p>{room.createdAt.toLocaleDateString()}</p>
                                        </div>
                                        <div className={`
                                            w-[25%] border-r border-primary-grey-200 text-white flex 
                                            text-center justify-center items-center
                                        `}>
                                            <p>{room.lastConnectionAt ? calculateTimeDifference(room.lastConnectionAt) : "0 minutes ago"}</p>
                                        </div>
                                        <div className={`
                                            w-[20%] flex justify-end items-center gap-2
                                        `}>
                                            {
                                                room.metadata.creator === username &&
                                                <Button
                                                    onClick={() => {
                                                        deleteRoom(room.id)
                                                    }}
                                                    className={`
                                                    px-2 bg-primary-black border border-red-500
                                                    hover:bg-red-500
                                                `}
                                                >
                                                    <Image
                                                        width={20}
                                                        height={20}
                                                        alt={'delete'}
                                                        src={'/assets/delete.svg'}
                                                    />
                                                </Button>
                                            }
                                            <Button
                                                onClick={() => {
                                                    enterRoom(room.id)
                                                }}
                                                className={`
                                                    bg-primary-black border border-primary-green text-white
                                                    hover:bg-primary-green hover:text-white
                                                `}
                                            >
                                                JOIN
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }
                            <div
                                className={`
                                         rounded w-full justify-between items-center
                                        cursor-pointer text-primary-grey-300 flex
                                        bg-primary-black
                                        p-2 gap-6
                                     `}
                            >

                                <Input
                                    value={id}
                                    onChange={(e) => {
                                        setId(e.target.value)
                                    }}
                                    className={'text-primary-grey-300 bg-transparent border-t-0 border-x-0 rounded border-b'}
                                    placeholder={'Write room name'}
                                />
                                <Button
                                    className={'text-primary-green border-2 border-primary-green hover:bg-primary-green hover:text-primary-black w-full'}
                                    onClick={() => {
                                        createRoom(id)
                                            .catch(() => {
                                                toast.error("This room already exists!")
                                            })
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
