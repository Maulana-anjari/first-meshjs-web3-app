"use client";

import { useEffect, useState } from "react";
import { BrowserWallet, type Wallet } from "@meshsdk/core";

export default function HomePage() {
  // State for wallet connection management
  const [eternlWallet, setEternlWallet] = useState<Wallet | undefined>(
    undefined
  );
  const [wallet, setWallet] = useState<BrowserWallet | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
    }
  }

  /**
   * Detects installed Cardano browser wallets and reads inspection data from URL/localStorage
   * when the component mounts.
   */
  useEffect(() => {
    const installedWallets = BrowserWallet.getInstalledWallets();
    const eternl = installedWallets.find((w) => w.name === "eternl");
    setEternlWallet(eternl);
  });

  /**
   * Connects the application to the wallet selected by the user.
   * @param walletName The name of the wallet to connect to.
   */
  async function connectWallet() {
    if (!eternlWallet) {
      setErrorMessage("Eternl wallet is not available.");
      return;
    }
    setIsConnecting(true);
    setErrorMessage(""); // Clear previous errors
    try {
      const enabledWallet = await BrowserWallet.enable("eternl");
      setWallet(enabledWallet);
      // Get and store the address to be used in API calls
      const addresses = await enabledWallet.getUsedAddresses();
      setWalletAddress(addresses[0]);
      setConnected(true);
    } catch (error: unknown) {
      handleError(error, "Failed to connect wallet");
    }
    setIsConnecting(false);
  }

  /**
   * Centralized helper function to handle and display errors.
   * @param error The error object.
   * @param prefix A prefix message to prepend to the error message.
   */
  function handleError(error: unknown, prefix = "An error occurred") {
    console.error(error);
    let message = "Unknown error.";
    if (error instanceof Error) {
      const errorData = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data;
      message = errorData?.message || error.message;
    }
    setErrorMessage(`${prefix}: ${message}`);
  }

  return (
    <main className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-content-bg rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-main">
            Develop your first Web3 App with MeshJS
          </h1>
        </div>

        {/* Section for connecting wallet */}
        <div className="mb-8 p-5 bg-main-bg rounded-lg border border-gray-700">
          {!connected ? (
            <div>
              {eternlWallet ? (
                <div className="text-center">
                  <p className="font-medium mb-4 text-text-main">
                    Eternl wallet detected. Please connect.
                  </p>
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="flex w-full sm:w-auto mx-auto items-center justify-center gap-2 bg-gray-700 text-text-main font-bold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-text-secondary disabled:cursor-not-allowed transition-colors"
                  >
                    <img
                      src={eternlWallet.icon}
                      alt={eternlWallet.name}
                      className="w-6 h-6"
                    />
                    <span>
                      {isConnecting ? "Connecting..." : "Connect Eternl"}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-semibold text-yellow-400 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <path d="M12 9v4"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    Eternl Wallet Not Found!
                  </p>
                  <p className="text-text-muted mt-2 text-sm">
                    To continue, you must first install the Eternl browser
                    extension.
                  </p>
                  <a
                    href="https://eternl.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors underline"
                  >
                    Visit eternl.io
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1.5"
                    >
                      <path d="M7 17l9.2-9.2M17 17V7H7"></path>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-green-500 font-semibold text-center flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Cardano Wallet Connected
              </p>
              <p
                className="text-white text-center break-all overflow-wrap-anywhere max-w-full"
                style={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
              >
                Address: {walletAddress}
              </p>
            </div>
          )}
        </div>

        {connected && (
          <>
            <h1>Get Wallet Assets</h1>
            {assets ? (
              <div
                className="w-full max-w-full overflow-auto bg-gray-900 rounded-lg p-2 border border-gray-700"
                style={{ maxHeight: "350px" }}
              >
                <pre
                  className="whitespace-pre-wrap break-all text-xs"
                  style={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
                >
                  <code className="language-js">
                    {JSON.stringify(assets, null, 2)}
                  </code>
                </pre>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => getAssets()}
                disabled={loading}
                style={{
                  margin: "8px",
                  backgroundColor: loading ? "orange" : "grey",
                }}
              >
                Get Wallet Assets
              </button>
            )}
          </>
        )}
        <div className="mt-6 space-y-4">
          {errorMessage && (
            <div className="text-sm text-red-400 bg-red-900/30 border border-red-500/50 p-3 rounded-md break-words">
              <p className="font-bold">An Error Occurred:</p>
              <p className="font-mono">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
