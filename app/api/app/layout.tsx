import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
title: "AXION AI — Intelligence Without Limits",
description:
"AXION AI is a multilingual AI assistant platform for a global audience.",
applicationName: "AXION AI"
};

export default function RootLayout({
children
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}
