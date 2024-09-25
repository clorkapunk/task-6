import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
    secret: process.env.NEXT_PUBLIC_LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: any) {
    const myJson = await request.json();
    const { roomId, userId, canWrite } = myJson;

    const session = liveblocks.prepareSession(userId);

    session.allow(roomId, canWrite ? session.FULL_ACCESS : session.READ_ACCESS);

    const { status, body } = await session.authorize();

    return new Response(body, { status });
}
