import React, {useEffect, useState} from 'react';
import {Liveblocks, RoomData} from "@liveblocks/node";
import {Spinner} from "@/components/ui/spinner";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { toast } from 'react-hot-toast';


type Props = {
    handleCreate: (roomId: string) => void,
    handleSelect: (id: string) => void,
}

const RoomSelection = ({handleCreate, handleSelect}: Props) => {
    const liveblocks = new Liveblocks({
        secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!
    })

    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [id, setId] = useState('')

    const validateRoomId = (): boolean => {
        return !rooms.find(i => i.id === id);
    }

    useEffect(() => {

        async function getRooms() {
            setIsFetching(true)
            const {data} = await liveblocks.getRooms()
            return data
        }

        if (!isFetching) getRooms().then(data => {
            setRooms(data)
            setIsFetching(false)
        })
            .catch(e => {
                toast.error("Error getting rooms")
            })
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
                                        onClick={() => handleSelect(i.id)}
                                        key={i.id}
                                        className={`
                                        border rounded w-[200px] h-[100px] flex justify-center items-center
                                        cursor-pointer text-primary-grey-300 bg-primary-grey-200 
                                        hover:bg-primary-green hover:border-none hover:text-primary-black
                                     `}
                                    >
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
                                        if(!validateRoomId()) {
                                            toast.error("Room ID already exists!")
                                            return;
                                        }
                                        handleCreate(id)
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
