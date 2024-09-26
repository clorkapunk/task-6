"use client";

import Image from "next/image";
import {memo, useEffect, useState} from "react";

import {navElements} from "@/constants";
import {ActiveElement, NavbarProps} from "@/types/type";

import {Button} from "./ui/button";
import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "./users/ActiveUsers";
import {NewThread} from "./comments/NewThread";
import {useUserStore} from "@/stores/user-store";
import UsersPermissionDialog from "@/components/UsersPermissionDialog";
import {useSelf} from "@/liveblocks.config";

const Navbar = ({activeElement, imageInputRef, handleImageUpload, handleActiveElement}: NavbarProps) => {
    const isActive = (value: string | Array<ActiveElement>) =>
        (activeElement && activeElement.value === value) ||
        (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));

    const [isOpenSettings, setIsOpenSettings] = useState(false);
    const self = useSelf()
    const leaveRoom = useUserStore((store) => store.leaveRoom)
    const [roomCreatorId, setRoomCreatorId] = useState('')
    const getRoomCreatorId = useUserStore((store) => store.getRoomCreatorId)

    useEffect(() => {
        getRoomCreatorId()
            .then(id => {
                setRoomCreatorId(id)
            })
            .catch(e => {
                console.log(e)
            })
    }, []);

    return (

        <nav
            style={{
                display: "flex",
                flex: '0 0 auto'
            }}
            className="flex  select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
            <Image src="/assets/logo.svg" alt="FigPro Logo" width={58} height={20}/>

            <ul className="flex flex-row">
                {self.canWrite && navElements.map((item: ActiveElement | any) => (
                    <li
                        key={item.name}
                        onClick={() => {
                            if (Array.isArray(item.value)) return;
                            handleActiveElement(item);
                        }}
                        className={`group px-2.5 py-5 flex justify-center items-center
            ${isActive(item.value) ? "bg-primary-green" : "hover:bg-primary-grey-200"}
            `}
                    >

                        {Array.isArray(item.value) ? (
                            <ShapesMenu
                                item={item}
                                activeElement={activeElement}
                                imageInputRef={imageInputRef}
                                handleActiveElement={handleActiveElement}
                                handleImageUpload={handleImageUpload}
                            />
                        ) : item?.value === "comments" ? (
                            <NewThread>
                                <Button className="relative w-5 h-5 object-contain">
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        fill
                                        className={isActive(item.value) ? "invert" : ""}
                                    />
                                </Button>
                            </NewThread>
                        ) : (
                            <Button className="relative w-5 h-5 object-contain">
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    fill
                                    className={isActive(item.value) ? "invert" : ""}
                                />
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            <div className={'flex flex-row items-center justify-center h-full gap-3'}>
                <ActiveUsers/>

                <div className={'flex '}>
                    {
                        self.id === roomCreatorId &&
                        <Button
                            className={'h-[60px] hover:bg-primary-grey-200 rounded-none'}
                            onClick={() => setIsOpenSettings(true)}
                        >
                            <Image
                                src={'/assets/users-gear.svg'}
                                alt={'settings'}
                                width={20}
                                height={20}
                            />
                        </Button>
                    }
                    <Button
                        className={'h-[60px] hover:bg-primary-grey-200 rounded-none'}
                        onClick={() => leaveRoom()}
                    >
                        <Image
                            src={'/assets/leave.svg'}
                            alt={'exit'}
                            width={20}
                            height={20}
                        />
                    </Button>
                </div>

            </div>

            <UsersPermissionDialog isOpen={isOpenSettings} setOpen={setIsOpenSettings}/>

        </nav>


    );
};

export default memo(Navbar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement);
