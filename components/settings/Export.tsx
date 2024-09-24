import { exportToPdf } from "@/lib/utils";

import { Button } from "../ui/button";
import React from "react";
import {fabric} from "fabric";


type Props = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasPages: any;
    activeObjectRef: any;
};
const Export = ({fabricRef, activeObjectRef, canvasPages}: Props) => (
  <div className='flex flex-col gap-3 px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Export</h3>
    <Button
      variant='outline'
      className='w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black'
      onClick={() => exportToPdf({fabricRef, activeObjectRef, canvasPages})}
    >
      Export to PDF
    </Button>
  </div>
);

export default Export;
