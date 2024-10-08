import React, {useRef} from 'react';
import Dimensions from "@/components/settings/Dimensions";
import Text from "@/components/settings/Text";
import Color from "@/components/settings/Color";
import Export from "@/components/settings/Export";
import {RightSidebarProps} from "@/types/type";
import {modifyShape} from "@/lib/shapes";
import {fabric} from "fabric";
import {useSelf} from "@/liveblocks.config";

const RightSidebar = ({
                          elementAttributes,
                          setElementAttributes,
                          fabricRef,
                          isEditingRef,
                          activeObjectRef,
                          syncShapeInStorage,
                          canvasPages,
                          fabricRenderRef
                      }: RightSidebarProps) => {

    const colorInputRef = useRef(null)
    const strokeInputRef = useRef(null)

    const handleInputChange = (property: string, value: string) => {
        if(!isEditingRef.current) isEditingRef.current = true

        setElementAttributes(prevState => ({
            ...prevState,
            [property]: value
        }))

        modifyShape({
            canvas: fabricRef.current as fabric.Canvas,
            property,
            value,
            activeObjectRef,
            syncShapeInStorage
        })
    }

    const self = useSelf()


    return (
        <section className={`
            flex flex-col border-t border-primary-grey-200 
            bg-primary-black text-primary-grey-300 min-w-[227px] sticky
            right-0 h-full max-sm:hidden select-none
        `}>
            <h3 className='px-5 pt-4 text-xs uppercase'>Design</h3>
            <span className={`text-xs mt-3 px-5 text-primary-grey-300 border-b border-primary-grey-200 pb-4`}>
                Make changes to canvas as you like
            </span>
            {
                self.canWrite &&
                <>
                    <Dimensions
                        width={elementAttributes.width}
                        height={elementAttributes.height}
                        handleInputChange={handleInputChange}
                        isEditingRef={isEditingRef}
                    />
                    <Text
                        fontFamily={elementAttributes.fontFamily}
                        fontSize={elementAttributes.fontSize}
                        fontWeight={elementAttributes.fontWeight}
                        handleInputChange={handleInputChange}
                    />
                    <Color
                        inputRef={colorInputRef}
                        attribute={elementAttributes.fill}
                        attributeType={'fill'}
                        placeholder={'color'}
                        handleInputChange={handleInputChange}
                    />
                    <Color
                        inputRef={strokeInputRef}
                        attribute={elementAttributes.stroke}
                        attributeType={'stroke'}
                        placeholder={'stroke'}
                        handleInputChange={handleInputChange}
                    />
                </>
            }


            <Export
                fabricRef={fabricRenderRef}
                canvasPages={canvasPages}
                activeObjectRef={activeObjectRef}
            />

        </section>
    );
};

export default RightSidebar;
