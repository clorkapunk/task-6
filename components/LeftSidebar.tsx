"use client";

import {useMemo} from "react";
import Image from "next/image";
import {getShapeInfo} from "@/lib/utils";

const LeftSidebar = ({allShapes, handleShapeZIndexChange}: {
    allShapes: Array<any>,
    handleShapeZIndexChange: (object: any, direction: string) => void
}) => {
    const memoizedShapes = useMemo(
        () => (
            <section
                className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
                <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">Layers</h3>
                <div className="flex flex-col">
                    {allShapes?.reverse().map((shape: any) => {
                        const info = getShapeInfo(shape[1]?.type);

                        return (
                            <div
                                key={shape[1]?.objectId}
                                className={'group my-1 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black flex justify-between items-center'}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={info?.icon}
                                        alt='Layer'
                                        width={16}
                                        height={16}
                                        className='group-hover:invert'
                                    />
                                    <h3 className='text-sm font-semibold capitalize'>{info.name}</h3>
                                </div>

                                <div className={'flex gap-1'}>
                                    <div
                                        className={'hover:bg-primary-grey-200 p-1 rounded px-2'}
                                        onClick={() => handleShapeZIndexChange(shape[0], 'up')}>
                                        <Image
                                            className={'-rotate-90'}
                                            src={'/assets/play.svg'}
                                            width={12}
                                            height={12}
                                            alt={'top'}
                                        />
                                    </div>

                                    <div
                                        className={'hover:bg-primary-grey-200 p-1 rounded px-2'}
                                        onClick={() => handleShapeZIndexChange(shape[0], 'down')}>
                                        <Image
                                            className={'rotate-90'}
                                            src={'/assets/play.svg'}
                                            width={12}
                                            height={12}
                                            alt={'top'}
                                        />
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </section>
        ),
        [allShapes]
    );

    return memoizedShapes;
};

export default LeftSidebar;
