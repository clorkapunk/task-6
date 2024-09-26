import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useUserStore} from "@/stores/user-store";
import {useOthers} from "@/liveblocks.config";

function objectToArray(obj: object) {
    return Object.entries(obj).map(([key, value]) => ({key, value}));
}


const UsersPermissionDialog = ({isOpen, setOpen}: { isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
    const [usersPermission, setUsersPermission] = useState<{ key: string, value: any }[]>([]);
    const getRoomPermission = useUserStore((store) => store.getRoomPermission)
    const updateRoomPermissions = useUserStore((store) => store.updateRoomPermissions)
    const [update, setUpdate] = useState(false)


    useEffect(() => {
        getRoomPermission()
            .then(data => {
                setUsersPermission(objectToArray(data))
            })
            .catch(e => {
                console.log(e)
            })
    }, [isOpen, update]);


    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] bg-primary-black">
                <DialogHeader>
                    <DialogTitle className={"text-xl text-primary-grey-300"}>Manage users permission</DialogTitle>
                </DialogHeader>

                <div className={'flex flex-col gap-2'}>
                    {
                        usersPermission.map((user) => (
                            <div key={user.key} className={'flex items-center justify-between p-2 pl-3 border rounded'}>
                                <p className={'text-white'}>{user.key}</p>
                                <Button
                                    className={`border-2 rounded 
                                        ${user.value[0] === 'room:write' ? " border-red-500 text-red-500 " : " border-primary-green text-primary-green "}
                                        ${user.value[0] === 'room:write' ? " hover:bg-red-500 hover:text-primary-black " : " hover:bg-primary-green hover:text-primary-black "}
                                       `}
                                    onClick={() => {
                                        updateRoomPermissions(user.key, !(user.value[0] === 'room:write'))
                                            .then(r => {
                                                setUpdate(!update)
                                            })


                                    }}
                                >
                                    {user.value[0] === 'room:write' ? "Deny" : "Allow"}
                                </Button>
                            </div>
                        ))
                    }
                </div>
            </DialogContent>
        </Dialog>

    );
};

export default UsersPermissionDialog;
