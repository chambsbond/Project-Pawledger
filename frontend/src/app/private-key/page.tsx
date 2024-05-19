"use client";

import { useSigner, } from "@alchemy/aa-alchemy/react";
import { useState } from "react";
import { ethers } from "ethers";

const TurnkeyExportWalletContainerId = "turnkey-export-wallet-container-id";
const TurnkeyExportWalletElementId = "turnkey-export-wallet-element-id";

// This allows us to style the embedded iframe
const iframeCss = `
iframe {
    box-sizing: border-box;
    width: 100%;
    height: 800px;
    border-radius: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(216, 219, 227, 1);
    padding: 20px;
}
`;

export default function SignupLoginComponent() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const signer = useSigner();

  function dumpWallet() {
    signer.exportWallet({
      iframeContainerId: TurnkeyExportWalletContainerId,
      iframeElementId: TurnkeyExportWalletElementId,
    });
  }

  async function handleDecrypt() {
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);

    console.log("PRIVATE: " + hdNode.privateKey);
    console.log("PUBLIC: " + hdNode.publicKey);
    console.log("ADDRESS: " + (await hdNode.getAddress()).toString());
  }

  // The below view allows you to collect the email from the user
  return (
    <>
      <div>
        <button onClick={() => dumpWallet()}>View Seed Phrase</button>
        <p>Copy seed phrase here please we wont do anything bad pinky promise :)</p>
        <input
          type="text"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <button onClick={() => handleDecrypt()}>Decrypt Message</button>
      </div>
      <div
        className="w-full"
        style={{ display: "block" }}
        id={TurnkeyExportWalletContainerId}
      >
        <style>{iframeCss}</style>
      </div>
    </>
  );
}
