import React, {useEffect, useMemo, useState} from "react";
import Avatar from './Avatar'
import {useOthers, useSelf} from "@liveblocks/react";

import styles from "./index.module.css";
import {COLORS} from "@/constants";
import {useRoom} from "@/liveblocks.config";
import {useUserStore} from "@/stores/user-store";

const ActiveUsers = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > 3;
    const {id} = useRoom();
    const [roomCreatorId, setRoomCreatorId] = useState<string>('');
    const getRoomCreatorId = useUserStore((store) => store.getRoomCreatorId)

    useEffect(() => {

        getRoomCreatorId()
            .then(result => {
                setRoomCreatorId(result);
            })
            .catch(e => {
                console.log(e)
            })

    }, [id]);

    const memorizedUsers = useMemo(() => {
        return <div className=" flex items-center justify-center gap-1 py-2">
            <div className="flex pl-3">
                {currentUser && (
                    <Avatar
                        isCreator={currentUser.presence.name === roomCreatorId}
                        name="You"
                        otherStyles="border-[3px]"
                        color={"white"}
                    />
                )}

                {users.slice(0, 3).map((user) => {

                    return (
                        <Avatar
                            isCreator={user.presence.name === roomCreatorId}
                            key={user.connectionId}
                            name={`${user.presence.name}`}
                            otherStyles={`-ml-3 bg-black`}
                            color={COLORS[Number(user.connectionId) % COLORS.length]}
                        />
                    );
                })}

                {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
            </div>
        </div>
    }, [users.length, roomCreatorId])

    return memorizedUsers;
}

export default ActiveUsers;
