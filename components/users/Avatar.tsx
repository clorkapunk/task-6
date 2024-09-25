import React from "react";
import styles from "./Avatar.module.css";


const Avatar = ({name, otherStyles, color, isCreator}:
                    {
                        otherStyles: string;
                        name: string,
                        color: string,
                        isCreator: boolean
                    }) => {
    return (
        <div
            className={`${styles.avatar} ${otherStyles} h-9 w-9 border-4 ${isCreator && "  border-primary-green "}`}
            data-tooltip={name}
            style={{background: `linear-gradient(45deg, rgba(200,200,200,1) 0%, ${color} 100%)`}}
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
