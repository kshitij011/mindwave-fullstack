"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    // Connect to Metamask
    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("MetaMask is not installed!");
            return;
        }

        setIsConnecting(true);

        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsConnecting(false); // ← stop loading
        }
    };

    // Auto-connect on reload (if already connected)
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };

        checkConnection();
    }, []);

    // Listen for account changes
    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = (accounts) => {
                if (accounts.length === 0) {
                    setAccount(null);
                } else {
                    setAccount(accounts[0]);
                }
            };

            window.ethereum.on("accountsChanged", handleAccountsChanged);

            return () => {
                window.ethereum.removeListener(
                    "accountsChanged",
                    handleAccountsChanged
                );
            };
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{ account, connectWallet, isConnecting }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
