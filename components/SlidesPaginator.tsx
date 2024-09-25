import React, {useEffect, useMemo, useState} from 'react';
import {CanvasPageData} from "@/types/type";
import {renderCanvas} from "@/lib/canvas";
import {fabric} from "fabric";
import Image from "next/image";
import {useSelf} from "@/liveblocks.config";

type Props = {
    handlePageChange: (page: number) => void;
    canvasPages: any;
    currentPageNumber: number;
    fabricRenderRef: React.RefObject<fabric.Canvas | null>;
    activeObjectRef: React.RefObject<fabric.Object | null>;
    handlePageAdd: () => void;
    handlePageDelete: (e: number) => void;
}

const renderCanvasPage = ({page, fabricRef, activeObjectRef}: {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    activeObjectRef: React.RefObject<fabric.Object | null>;
    page: any;
}): string => {
    const canvas = document.querySelector("canvas");
    const canvasToRender: HTMLCanvasElement | null = document.querySelector("#renderCanvas");


    if (!canvas) {
        console.log('no canvas element')
        return "";
    }

    if (!canvasToRender) {
        console.log('no canvas render element')
        return "";
    }

    renderCanvas({
        fabricRef,
        canvasObjects: page.data,
        activeObjectRef
    })

    return canvasToRender.toDataURL()
}

const SlidesPaginator = ({
                             handlePageChange,
                             canvasPages,
                             currentPageNumber,
                             fabricRenderRef,
                             activeObjectRef,
                             handlePageAdd,
                             handlePageDelete
                         }: Props) => {

    const [isReady, setIsReady] = useState(false);

    const self = useSelf()

    useEffect(() => {
        if (fabricRenderRef.current) setIsReady(true);
    }, [fabricRenderRef.current])

    const memorized = useMemo(() => {
        return (<div
            className={`h-[100px] flex flex-row items-end gap-3 mb-2 absolute bottom-0 right-1/2 translate-x-1/2 rounded `}
            style={{
                width: '70%',
                overflowX: 'scroll',
                overflowY: 'hidden',
                scrollbarWidth: "thin",
                scrollbarColor: "#14181F transparent"
            }}
        >

            {
                canvasPages?.map((page: CanvasPageData) => {
                    if (isReady) {
                        return (
                            <div key={page.pageNumber}
                                 className={`
                                    overflow-visible
                                    relative h-[70px] aspect-video rounded 
                                    cursor-pointer group z-10
                                `}
                                 onClick={() => handlePageChange(page.pageNumber)}
                            >
                                <div className={'absolute bottom-full text-gray-500 text-xs'}>
                                    Page {page.pageNumber}
                                </div>
                                {
                                    canvasPages.length > 1 &&
                                    <div
                                        className={`
                                        justify-end items-start hidden absolute 
                                        w-full bg-transparent group-hover:flex p-1
                                    `}
                                    >
                                        <div
                                            className={'hover:border-primary-black border p-1 rounded'}
                                        >
                                            <Image
                                                style={{
                                                    filter: "invert(0.9)"
                                                }}
                                                width={20}
                                                height={20}
                                                objectFit={'cover'}
                                                src={'/assets/delete.svg'}
                                                alt={"delete"}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handlePageDelete(page.pageNumber)
                                                }}
                                            />
                                        </div>

                                    </div>
                                }
                                <Image
                                    height={0}
                                    width={0}
                                    className={`
                                        w-full h-[70px] bg-white border-primary-green rounded 
                                        ${currentPageNumber === page.pageNumber && " border-2 "}
                                    `}
                                    src={renderCanvasPage({page, fabricRef: fabricRenderRef, activeObjectRef})}
                                    alt={`${page.pageNumber} page`}
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div
                                key={page.pageNumber}
                                className={`
                                    relative aspect-video h-full bg-teal-50 rounded cursor-pointer
                                    ${currentPageNumber === page.pageNumber && " border-2 border-primary-green "}
                                `}
                                onClick={() => handlePageChange(page.pageNumber)}
                            />
                        )
                    }
                })
            }
            {
                self.canWrite &&
                <div
                    className={
                        `h-[70px] aspect-video border border-white bg-transparent 
                        rounded flex justify-center items-center cursor-pointer`
                    }
                    onClick={() => handlePageAdd()}

                >
                    <Image
                        width={24}
                        height={24}
                        src={"/assets/plus.svg"}
                        alt={"plus"}
                    />
                </div>
            }
        </div>)
    }, [canvasPages, currentPageNumber, fabricRenderRef, isReady, self])

    return memorized;
};

export default SlidesPaginator;
