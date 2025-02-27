"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
    return (
        <Toaster
            toastOptions={{
                style: {
                    background: '#ffffff',
                    color: '#474747',
                },
            }}
        />
    );
}
