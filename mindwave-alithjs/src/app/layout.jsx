import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./contexts/WalletContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ContractProvider } from "./contexts/ContractContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Mindwave alith",
    description: "Tokenizing human intelligence.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <WalletProvider>
                    <ContractProvider>
                        <div className="relative h-screen w-screen">
                            <Sidebar />
                            <div className="relative flex flex-col flex-1 transition-all overflow-auto">
                                <Navbar />
                                <main className="">{children}</main>
                            </div>
                        </div>
                    </ContractProvider>
                </WalletProvider>
            </body>
        </html>
    );
}
