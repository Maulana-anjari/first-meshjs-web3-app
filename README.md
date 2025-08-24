# Develop your first Web3 App with Next.js & Mesh

In this guide, we will set up a Next.js application and connect it to the Cardano blockchain using Mesh. We will create a simple app that allows users to connect their wallets and view the assets in their wallets.

Though this guide is focused on Next.js (using Mesh React), you can also use Mesh with other frameworks like Remix, React, and Vue. Mesh SDK has Svelte UI components too.

You may follow this guide to set up your project or use the Mesh CLI to scaffold a new project:

```bash
npx meshjs your-app-name
```

## Setup Next.js

Next.js is a web development framework built on top of Node.js enabling React-based web applications functionalities such as server-side rendering and generating static websites.

1. **Create project folder and open Visual Studio Code**

   - Create a new folder for your project, and give the folder a meaningful name. Open Visual Studio Code and open your project folder.

2. **Create Next.js app**
   - Open the Terminal and execute this command to create a new Next.js application:

```bash
npx create-next-app@latest --typescript .
```

     - Recommended options:
    	 - Use ESLint: Yes
    	 - Use Tailwind CSS: Yes
    	 - Use code inside a `src/` directory: Yes
    	 - Use App Router: No
    	 - Use Turbopack for next dev: No
    	 - Customize import alias: No

3. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your application. Press CTRL+C to stop the application.

## Setup Mesh

Mesh is a JavaScript library that provides a simple way to interact with the Cardano blockchain. It provides a set of APIs that allow you to interact with Cardano without dealing with its complexities.

Install the latest version of Mesh:

```bash
npm install @meshsdk/core @meshsdk/react
```

Your Next.js application is now ready to connect wallets, browse assets, and make transactions.

## Connect wallet and view assets

### 1. Add MeshProvider

React context is essential for building web applications. It allows you to easily share state in your applications, so you can use the data in any component within the app. This means that when the user has connected their wallet, visiting different pages on the app ensures their wallet is still connected.

Open `src/app/providers.tsx`, import and include `MeshProvider`:

```tsx
import "@meshsdk/react/styles.css";
import { MeshProvider } from "@meshsdk/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MeshProvider>{children}</MeshProvider>;
}
```

### 2. Add connect wallet component and check wallet's assets

Add the connect wallet component to allow users to connect wallets they have installed. Connecting to wallets will ask the user for permission if not granted, and proceed to connect the selected wallet.

Link those components together, allowing users to choose a wallet to connect, and query for assets in the wallet with `wallet.getAssets()`.

Open `src/app/page.tsx` and replace it with the following code:

```tsx
"use client";
import { useState } from "react";
import { useWallet, CardanoWallet } from "@meshsdk/react";

export default function Home() {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Connect Wallet</h1>
      <CardanoWallet />
      {connected && (
        <>
          <h1>Get Wallet Assets</h1>
          {assets ? (
            <pre>
              <code className="language-js">
                {JSON.stringify(assets, null, 2)}
              </code>
            </pre>
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
    </div>
  );
}
```

Start the development server and try it:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to connect available wallets and view the assets in wallet.

If you do not have any assets in your wallet, you can receive test ADA (tADA) from the official faucet.

If you are new to Cardano, you will first have to download one of the Cardano wallets. There are many guides online to help you understand the fundamentals of a Cardano wallet, including its features and how it works.

## Try on your own

Implement another component to display wallet's address and the amount of lovelace in your Next.js application. Check out the wallet page for more details.
