import React from "react";
import styles from "./Avatar.module.css";
import Image from "next/image";


const Avatar = ({name, otherStyles, color}: { otherStyles: string; name: string, color: string}) => {
    return (
        <div
            className={`${styles.avatar} ${otherStyles} h-9 w-9`}
            data-tooltip={name}
            style={{backgroundColor: color}}
        >
            {/*<Image*/}
            {/*    src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}*/}
            {/*    fill*/}
            {/*    alt={name}*/}
            {/*/>*/}
        </div>
    );
}

export default Avatar;
