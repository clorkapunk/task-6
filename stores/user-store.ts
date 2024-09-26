import {create} from "zustand";
import {Liveblocks, RoomAccesses, RoomData} from "@liveblocks/node";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    uid: string;
}
type AuthEndpoint = {
    token: string
}

export type UserStore = {
    isAuth: boolean;
    token: AuthEndpoint;
    isRoomSelected: boolean;
    roomId: string;
    username: string;
    setUsername: (username: string| null) => void;
    rooms: RoomData[];
    getRooms: () => void;
    login: (username: string | null) => Promise<boolean>;
    logout: () => void;
    authCheck: () => Promise<boolean>;
    enterRoom: (roomId: string | null) => void;
    leaveRoom: () => void;
    createRoom: (roomId: string) => Promise<any>;
    deleteRoom: (roomId: string) => void;
    getUserDetails: () => void;
    getRoomCreatorId: () => Promise<string>;
    getRoomPermission: () => Promise<RoomAccesses>;
    auth: (canWrite: boolean) => Promise<any>;
    updateRoomPermissions: (userId: string, canWrite: boolean) => Promise<boolean>;
}

const liveblocks = new Liveblocks({
    secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!
})

export const useUserStore = create<UserStore>((set, getState) => ({
    isAuth: false,
    isRoomSelected: false,
    roomId: '',
    token: {token: ''},
    username: '',
    rooms: [],
    setUsername: (username: string| null) => {
        if(!username) return;
        sessionStorage.setItem("username", username)
        set(() => ({
            isAuth: true,
            username
        }))
    },
    getRooms: () => {
        async function getRoomsCall() {
            const {data} = await liveblocks.getRooms();
            return data
        }

        getRoomsCall()
            .then(rooms => {
                set({rooms})
            })
            .catch(e => {
                console.log(e)
            })


    },
    login: (username: string | null): Promise<boolean> => {
        async function identifUserCall(username: string) {
            const {body, status} = await liveblocks.identifyUser({
                userId: username,
                groupIds: [
                    "spectator"
                ]
            })

            return JSON.parse(body).token.toString()
        }
        return new Promise((resolve, reject) => {


            if (!username) {
                reject(false);
            } else {

                identifUserCall(username)
                    .then(token => {
                        sessionStorage.setItem("token", token);
                        set((state: UserStore) => ({
                            isAuth: true,
                            username
                        }))
                        resolve(true)
                    })
                    .catch(e => {
                        set((state: UserStore) => ({
                            isAuth: false,
                            username: ""
                        }))
                        resolve(false)
                    })
            }


        })
    },
    logout: () => {
        sessionStorage.removeItem("username");
        set((state: UserStore) => ({
            isAuth: false,
            username: '',
            isRoomSelected: false,
            roomId: ''
        }))
    },
    authCheck: (): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            const token = sessionStorage.getItem("token")
            if (!token) {
                set((state: UserStore) => ({
                    isAuth: false,
                    username: ""
                }))
                resolve(false)
            } else {
                const decode = jwtDecode(token) as JwtPayload
                getState()
                    .login(decode.uid)
                    .then(r => {
                        resolve(r)
                    })
                    .catch(e => {
                        reject(e)
                    })

            }
        })

    },
    enterRoom: (roomId: string | null) => {
        if (!roomId) return;
        sessionStorage.setItem("room-id", roomId)
        set((state: UserStore) => ({
            isRoomSelected: true,
            roomId
        }))
    },
    leaveRoom: () => {
        sessionStorage.removeItem("room-id")
        set((state: UserStore) => ({
            isRoomSelected: false,
            roomId: ""
        }))
    },
    createRoom: (roomId: string) => {
        return new Promise((resolve, reject) => {
            const username = getState().username
            if (!roomId || !username) {
                return new Error("Room id and username must be provided");
            }

            async function createRoomCall() {
                return await liveblocks.createRoom(roomId, {
                    defaultAccesses: ["room:write"],
                    metadata: {
                        creator: username
                    },
                    usersAccesses: {
                        [username]: ["room:write"]
                    }
                })
            }

            createRoomCall()
                .then((room) => {
                    resolve('')
                    getState().getRooms()
                })
                .catch(e => {
                   reject(e)
                })
        })


    },
    deleteRoom: (roomId: string) => {
        async function deleteRoomCall() {
            return await liveblocks.deleteRoom(roomId)
        }

        deleteRoomCall()
            .then(res => {
                console.log(res)
                getState().getRooms()
            })
            .catch(e => {
                console.log(e)
            })
    },
    getUserDetails: () => {

    },
    getRoomCreatorId: () => {
        return new Promise((resolve, reject) => {
            liveblocks.getRoom(getState().roomId)
                .then(room => {
                    const creator = room.metadata.creator as string
                    resolve(creator)
                })
                .catch(e => {
                    reject(e)
                })
        })
    },
    getRoomPermission: () => {
        return new Promise((resolve, reject) => {
            liveblocks.getRoom(getState().roomId)
                .then(room => {
                    resolve(room.usersAccesses)
                })
                .catch(e => {
                    reject(e)
                })
        })
    },
    auth: async (canWrite: boolean) => {
        const headers = {
            "Content-Type": "application/json",
        };

        const body = JSON.stringify({
            roomId: getState().roomId,
            userId:  getState().username,
            canWrite
        });

        const response = await fetch("/api/liveblocks-auth", {
            method: "POST",
            headers,
            body,
        });

        const data = await response.json()

        return data
    },
    updateRoomPermissions: (userId: string, canWrite: boolean) => {
        return new Promise(async (resolve) => {
            await liveblocks.updateRoom(getState().roomId, {
                usersAccesses: {
                    [userId]: canWrite ? ["room:write"] : ['room:read', 'room:presence:write']
                }
            })
            resolve(true)
        })

    }
}));
