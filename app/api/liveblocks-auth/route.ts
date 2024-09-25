// app/api/liveblocks-auth/route.ts
import { Liveblocks } from "@liveblocks/node";
import {NextResponse} from "next/server";

const liveblocks = new Liveblocks({
    secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!,
});

function objectToArray(obj: object) {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
}


export async function POST(request: any) {
    const myJson = await request.json();
    const {roomId, userId} = myJson

    const session = liveblocks.prepareSession(userId);

    const room = await liveblocks.getRoom(roomId)

    const array: {key:string, value:any}[] = objectToArray(room.usersAccesses)

    const index = array.findIndex(i => i.key === userId)

    if(index === -1){
        await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [userId]: ['room:read', 'room:presence:write']
            }
        })
        session.allow(roomId, session.READ_ACCESS);
    }
    else{
        session.allow(roomId, array[index].value)
    }

    const { status, body } = await session.authorize();
    return new Response(body, { status });
}
