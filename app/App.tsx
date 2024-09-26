"use client"

import {fabric} from "fabric";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import {useEffect, useRef, useState} from "react";
import {
    handleCanvaseMouseMove,
    handleCanvasMouseDown,
    handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectScaling, handleCanvasSelectionCreated,
    handleResize,
    initializeFabric, renderCanvas
} from "@/lib/canvas";
import {ActiveElement, Attributes} from "@/types/type";
import {useMutation, useMyPresence, useRedo, useSelf, useStorage, useUndo} from "@/liveblocks.config";
import {defaultNavElement} from "@/constants";
import {handleDelete, handleKeyDown} from "@/lib/key-events";
import {handleImageUpload} from "@/lib/shapes";
import SlidesPaginator from "@/components/SlidesPaginator";
import {LiveMap, LiveObject} from "@liveblocks/client";
import {useClient} from "@liveblocks/react";

export default function Page() {
    const undo = useUndo();
    const redo = useRedo();

    const self = useSelf()

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasToRenderRef = useRef<HTMLCanvasElement>(null);
    const fabricRenderRef = useRef<fabric.Canvas | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isDrawing = useRef(false)
    const shapeRef = useRef<fabric.Object | null>(null)
    const selectedShapeRef = useRef<string | null>(null)
    const activeObjectRef = useRef<fabric.Object | null>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const isEditingRef = useRef<boolean>(false)

    const [elementAttributes, setElementAttributes] = useState<Attributes>({
        width: '',
        height: '',
        fontSize: '',
        fontFamily: "",
        fill: "#aabbcc",
        fontWeight: "",
        stroke: "#aabbcc"

    })

    const pageRef = useRef<number>(1)
    const [page, setPage] = useState<number>(1);


    const canvasObjects = useStorage((root) =>
        root.canvasPages.find(i => i.pageNumber === page)?.data
    )
    const canvasPages = useStorage((root) => root.canvasPages)

    const syncShapeInStorage = useMutation(({storage}, object) => {
        if (!object) return;


        const {objectId} = object;
        const shapedData = object.toJSON();
        shapedData.objectId = objectId

        // const canvasObjects = storage.get('canvasObjects');
        // canvasObjects.set(objectId, shapedData);

        const currentPageCanvasObjects = storage.get('canvasPages').find(i => {
            if (i.get("pageNumber") === pageRef.current) return i;
        })?.get("data")

        if (currentPageCanvasObjects) {
            currentPageCanvasObjects.set(objectId, shapedData)
        }
    }, [])

    const addPage = useMutation(({storage}) => {
        const canvasPages = storage.get('canvasPages');

        canvasPages.push(new LiveObject<{ pageNumber: number; data: LiveMap<string, any> }>({
            pageNumber: canvasPages.length + 1,
            data: new LiveMap<string, any>()
        }))
    }, [])

    const deletePage = useMutation(({storage}, pageNumber: number) => {
        const canvasPages = storage.get('canvasPages');

        const index = canvasPages.findIndex(i => i.get("pageNumber") === pageNumber)
        console.log(pageNumber, index)
        if (index === -1) return;
        canvasPages.delete(index)
        canvasPages.forEach((page, index) => {
            page.set("pageNumber", index + 1)
        })
    }, [])

    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: '',
        value: '',
        icon: ''
    })

    const moveObjectByZAxis = useMutation(({storage}, objectId, direction) => {

        if (!objectId) return;

        const currentPageCanvasObjects = storage.get('canvasPages').find(i => {
            if (i.get("pageNumber") === pageRef.current) return i;
        })?.get("data")

        if (!currentPageCanvasObjects || currentPageCanvasObjects.size === 0) return;

        const objectsTemp = currentPageCanvasObjects.clone()
        const object = objectsTemp.get(objectId)
        for (const [key, value] of currentPageCanvasObjects.entries()) {
            currentPageCanvasObjects.delete(key);
        }

        if (direction === 'down') {
            currentPageCanvasObjects.set(objectId, object)
        }

        for (const [key, value] of objectsTemp.entries()) {
            if (key === objectId) continue;
            currentPageCanvasObjects.set(key, value);
        }

        if (direction === 'up') {
            currentPageCanvasObjects.set(objectId, object)
        }


    }, [])
    const deleteAllShapes = useMutation(({storage}) => {
        // const canvasObjects = storage.get('canvasObjects');
        //
        // if(!canvasObjects || canvasObjects.size === 0) return true;
        // for (const [key, value] of canvasObjects.entries()) {
        //     canvasObjects.delete(key);
        // }
        //
        // return canvasObjects.size === 0;


        const currentPageCanvasObjects = storage.get('canvasPages').find(i => {
            if (i.get("pageNumber") === pageRef.current) return i;
        })?.get("data")

        if (!currentPageCanvasObjects || currentPageCanvasObjects.size === 0) return true;
        for (const [key, value] of currentPageCanvasObjects.entries()) {
            currentPageCanvasObjects.delete(key);
        }

        return currentPageCanvasObjects.size === 0
    }, [])
    const deleteShapeFromStorage = useMutation(({storage}, objectId) => {
        // const canvasObjects = storage.get('canvasObjects');
        // canvasObjects.delete(objectId)

        const currentPageCanvasObjects = storage.get('canvasPages').find(i => {
            if (i.get("pageNumber") === pageRef.current) return i;
        })?.get("data")
        if (currentPageCanvasObjects) currentPageCanvasObjects.delete(objectId)


    }, [])
    const [myPresence, updateMyPresence] = useMyPresence() as any;

    const handleActiveElement = (elem: ActiveElement) => {
        setActiveElement(elem)

        switch (elem?.value) {
            case "reset":
                deleteAllShapes();
                fabricRef.current?.clear()
                setActiveElement(defaultNavElement)
                break;
            case "delete":
                handleDelete(fabricRef.current as any, deleteShapeFromStorage)
                setActiveElement(defaultNavElement)
                break;
            case "image":
                imageInputRef.current?.click();
                isDrawing.current = false;
                if (fabricRef.current) {
                    fabricRef.current.isDrawingMode = false
                }
                break;
            default:
                break;
        }


        selectedShapeRef.current = elem?.value as string;
    }

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber)
        pageRef.current = pageNumber
        updateMyPresence({
            ...myPresence,
            page: pageNumber
        })
    }


    useEffect(() => {
        const canvas = initializeFabric({canvasRef, fabricRef})
        const canvasToRender = initializeFabric({fabricRef: fabricRenderRef, canvasRef: canvasToRenderRef})

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({
                options,
                canvas,
                isDrawing,
                shapeRef,
                selectedShapeRef
            })
        })

        canvas.on("mouse:up", (options) => {
            handleCanvasMouseUp({
                canvas,
                isDrawing,
                shapeRef,
                selectedShapeRef,
                syncShapeInStorage,
                setActiveElement,
                activeObjectRef
            })
        })

        canvas.on("mouse:move", (options) => {
            handleCanvaseMouseMove({
                options,
                canvas,
                isDrawing,
                shapeRef,
                selectedShapeRef,
                syncShapeInStorage
            })
        })

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({
                options,
                syncShapeInStorage
            })
        })

        canvas.on("selection:created", (options) => {
            handleCanvasSelectionCreated({
                options,
                isEditingRef,
                setElementAttributes
            })
        })

        canvas.on("object:scaling", (options) => {
            handleCanvasObjectScaling({
                options,
                setElementAttributes
            })
        })

        if (!self.canWrite) canvas.removeListeners();

        window.addEventListener("resize", () => {
            handleResize({canvas: fabricRef.current})
        })

        window.addEventListener("keydown", (e) => {
            handleKeyDown({
                e,
                canvas: fabricRef.current,
                undo,
                redo,
                syncShapeInStorage,
                deleteShapeFromStorage
            })
        })

        return () => {
            canvas.dispose()
            canvasToRender.dispose()
        }

    }, [])

    useEffect(() => {
        if (!canvasObjects) {
            if (page !== 1) handlePageChange(page - 1)
        } else {
            renderCanvas({
                fabricRef,
                canvasObjects,
                activeObjectRef
            })
        }


    }, [page, canvasObjects])


    return (
        <main className={"h-screen overflow-hidden"}>

            <div className="h-full flex flex-col">

                <Navbar
                    activeElement={activeElement}
                    handleActiveElement={handleActiveElement}
                    imageInputRef={imageInputRef}
                    handleImageUpload={(e: any) => {
                        e.stopPropagation()
                        handleImageUpload({
                            file: e.target.files[0],
                            canvas: fabricRef as any,
                            shapeRef,
                            syncShapeInStorage
                        })
                    }}
                />


                <section className='flex flex-row  h-[94vh]'>

                    <LeftSidebar
                        allShapes={Array.from(canvasObjects || [])}
                        handleShapeZIndexChange={moveObjectByZAxis}
                    />

                    <div className={'w-full  flex gap-4 justify-between py-4 px-6'}>
                        <Live canvasRef={canvasRef} currentPageNumber={page}/>

                        <SlidesPaginator
                            handlePageAdd={() => addPage()}
                            canvasPages={canvasPages}
                            handlePageChange={handlePageChange}
                            currentPageNumber={page}
                            fabricRenderRef={fabricRenderRef}
                            activeObjectRef={activeObjectRef}
                            handlePageDelete={deletePage}
                        />

                    </div>




                    <RightSidebar
                        canvasPages={canvasPages}
                        elementAttributes={elementAttributes}
                        setElementAttributes={setElementAttributes}
                        fabricRef={fabricRef}
                        isEditingRef={isEditingRef}
                        activeObjectRef={activeObjectRef}
                        syncShapeInStorage={syncShapeInStorage}
                        fabricRenderRef={fabricRenderRef}
                    />


                </section>


            </div>

            <canvas
                id={'renderCanvas'}
                ref={canvasToRenderRef}
                className={'absolute opacity-0 right-full hidden -z-20'}
            />
        </main>
    );
}
