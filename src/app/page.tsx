"use client";

import { useEffect, useState } from "react";
import { BrowserWallet, type Wallet } from "@meshsdk/core";

export default function HomePage() {
  // State for wallet connection management
  const [installedWallets, setInstalledWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [wallet, setWallet] = useState<BrowserWallet | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assets, setAssets] = useState<null | any>(null);

  async function getAssets() {
    if (wallet) {
      const _assets = await wallet.getAssets();
      setAssets(_assets);
    }
  }

  function disconnectWallet() {
    setWallet(undefined);
    setWalletAddress(undefined);
    setConnected(false);
    setSelectedWallet("");
  }

  useEffect(() => {
    const wallets = BrowserWallet.getInstalledWallets();
    setInstalledWallets(wallets);
    if (wallets.length > 0) {
      setSelectedWallet(wallets[0].name);
    }
  });

  /**
   * Connects the application to the wallet selected by the user.
   * @param walletName The name of the wallet to connect to.
   */
  async function connectWalletWithName(walletName: string) {
    setSelectedWallet(walletName);
    setIsConnecting(true);
    try {
      const enabledWallet = await BrowserWallet.enable(walletName);
      setWallet(enabledWallet);
      // Get and store the address to be used in API calls
      const addresses = await enabledWallet.getUsedAddresses();
      setWalletAddress(addresses[0]);
      setConnected(true);
    } catch (error: unknown) {
      console.error(`Failed to connect wallet: ${walletName}`);
    }
    setIsConnecting(false);
  }

  return (
    <main className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-content-bg rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-main">
            Develop your first Web3 App with MeshJS
          </h1>
          <p>Friends of HackQuest</p>
        </div>

        {/* Section for connecting wallet */}
        <div className="mb-8 p-5 bg-main-bg rounded-lg border border-gray-700">
          {!connected ? (
            <div className="text-center">
              {installedWallets.length > 0 ? (
                <>
                  <p className="font-medium mb-4 text-text-main">
                    Select a Cardano wallet to connect:
                  </p>
                  <div className="mb-4 flex flex-col items-center gap-2">
                    {installedWallets.map((w) => (
                      <button
                        key={w.name}
                        onClick={async () => {
                          setSelectedWallet(w.name);
                          await connectWalletWithName(w.name);
                        }}
                        disabled={isConnecting}
                        className="flex items-center justify-center gap-2 bg-gray-700 text-text-main font-bold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-text-secondary disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                      >
                        {w.icon && (
                          <img src={w.icon} alt={w.name} className="w-6 h-6" />
                        )}
                        {isConnecting && selectedWallet === w.name
                          ? "Connecting..."
                          : `Connect ${w.name}`}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold text-yellow-400 flex items-center justify-center">
                    No Cardano Wallet Found!
                  </p>
                  <p className="text-text-muted mt-2 text-sm">
                    To continue, please install a Cardano browser wallet
                    extension (e.g. Eternl, Nami, Flint, Lace).
                  </p>
                </>
              )}
            </div>
          ) : (
            <div>
              <p className="text-green-500 font-semibold text-center flex items-center justify-center gap-2">
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
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold transition-colors shadow-md bg-primary text-white hover:bg-primary-hover hover:cursor-pointer"
                style={{ margin: "8px" }}
              >
                Get Wallet Assets
              </button>
            )}
          </>
        )}
        {connected && (
          <button
            onClick={disconnectWallet}
            className="mt-5 flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold transition-colors shadow-md bg-primary text-white hover:bg-primary-hover hover:cursor-pointer"
          >
            Disconnect Wallet
          </button>
        )}
      </div>
    </main>
  );
}
