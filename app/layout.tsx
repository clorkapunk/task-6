import type {Metadata} from "next";
import {Work_Sans} from "next/font/google";
import "./globals.css";
import {Room} from "@/app/Room";
import { Toaster } from "react-hot-toast";


const workSans = Work_Sans({
    subsets: ['latin'],
    variable: '--font-work-sans',
    weight: ['400', '600', '700']
})

export const metadata: Metadata = {
    title: "Task 6",
    description: "Literally Figma clone",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {


    return (
        <html lang="en">
        <body className={`${workSans.variable} bg-primary-grey-200 antialiased`}>
        <Toaster position="bottom-center" />
        <Room>
            {children}
        </Room>
        </body>
        </html>
    );
}
