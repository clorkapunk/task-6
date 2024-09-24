import jsPDF from "jspdf";
import {twMerge} from "tailwind-merge";
import {type ClassValue, clsx} from "clsx";
import {renderCanvas} from "@/lib/canvas";
import {CanvasPageData, RenderCanvas} from "@/types/type";
import React from "react";
import {fabric} from "fabric";
import {any} from "prop-types";
import {LiveMap, LiveObject} from "@liveblocks/client";

const adjectives = [
    "Happy",
    "Creative",
    "Energetic",
    "Lively",
    "Dynamic",
    "Radiant",
    "Joyful",
    "Vibrant",
    "Cheerful",
    "Sunny",
    "Sparkling",
    "Bright",
    "Shining",
];

const animals = [
    "Dolphin",
    "Tiger",
    "Elephant",
    "Penguin",
    "Kangaroo",
    "Panther",
    "Lion",
    "Cheetah",
    "Giraffe",
    "Hippopotamus",
    "Monkey",
    "Panda",
    "Crocodile",
];

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateRandomName(): string {
    const randomAdjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    return `${randomAdjective} ${randomAnimal}`;
}

export const getShapeInfo = (shapeType: string) => {
    switch (shapeType) {
        case "rect":
            return {
                icon: "/assets/rectangle.svg",
                name: "Rectangle",
            };

        case "circle":
            return {
                icon: "/assets/circle.svg",
                name: "Circle",
            };

        case "triangle":
            return {
                icon: "/assets/triangle.svg",
                name: "Triangle",
            };

        case "line":
            return {
                icon: "/assets/line.svg",
                name: "Line",
            };

        case "i-text":
            return {
                icon: "/assets/text.svg",
                name: "Text",
            };

        case "image":
            return {
                icon: "/assets/image.svg",
                name: "Image",
            };

        case "freeform":
            return {
                icon: "/assets/freeform.svg",
                name: "Free Drawing",
            };

        default:
            return {
                icon: "/assets/rectangle.svg",
                name: shapeType,
            };
    }
};

type MyObj = {
    pageNumber: number;
    data: Map<string, any>;
}


export const exportToPdf = ({fabricRef, canvasPages, activeObjectRef}: {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasPages: MyObj[];
    activeObjectRef: any;
}) => {


    const canvas = document.querySelector("canvas");
    const canvasToRender: HTMLCanvasElement | null = document.querySelector("#renderCanvas");

    if (!canvas || !canvasToRender) return;

    canvasToRender.width = canvas.width;
    canvasToRender.height = canvas.height;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvasToRender.width, canvasToRender.height],
    });

    const addImageToPage = (page: number, imageSrc: string, isLastPage: boolean) => {
        doc.addImage(imageSrc, 'PNG', 0, 0, canvasToRender.width, canvasToRender.height); // Пример размещения изображения в верхнем левом углу
        if (!isLastPage) {
            doc.addPage();
        }
    };

    canvasPages.forEach((page, index) => {
        console.log(`Rendering page ${page.pageNumber}`)
        renderCanvas({
            fabricRef,
            canvasObjects: page.data,
            activeObjectRef
        })
        const data = canvasToRender.toDataURL();

        addImageToPage(page.pageNumber, data, index === canvasPages.length - 1)
    })


    // // download the pdf
    doc.save("canvas.pdf");
};
