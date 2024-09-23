import React, {useMemo} from "react";
import Avatar from './Avatar'
import {useOthers, useSelf} from "@liveblocks/react";

import styles from "./index.module.css";
import {generateRandomName} from "@/lib/utils";
import {COLORS} from "@/constants";

const ActiveUsers = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > 3;

    const memorizedUsers = useMemo(() => {
        return <div className=" flex items-center justify-center gap-1 py-2">
            <div className="flex pl-3">
                {currentUser && (
                    <Avatar
                        name="You"
                        otherStyles="border-[3px] border-primary-green"
                        color={"white"}
                    />
                )}

                {users.slice(0, 3).map(({connectionId}) => {
                    return (
                        <Avatar
                            key={connectionId}
                            name={generateRandomName()}
                            otherStyles={`-ml-3 bg-black`}
                            color={COLORS[Number(connectionId) % COLORS.length]}
                        />
                    );
                })}

                {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
            </div>
        </div>
    }, [users.length])

    return memorizedUsers;
}

export default ActiveUsers;
