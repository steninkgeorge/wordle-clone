// components/toast-provider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "!bg-white !text-black !shadow-lg !border !border-gray-200",
        duration: 3000,
        success: {
          className: "!bg-green-50 !text-green-800 !border-green-200",
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          className: "!bg-red-50 !text-red-800 !border-red-200",
        },
      }}
    />
  );
};
