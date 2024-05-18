"use client"

import { useSigner } from "@alchemy/aa-alchemy/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

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
  const [email, setEmail] = useState<string>("");
  const signer = useSigner();

  // we are using react-query to handle loading states more easily, but feel free to use w/e state management library you prefer
  const { mutate: loginOrSignup, isLoading } = useMutation({
    mutationFn: (email: string) =>
      signer.authenticate({ type: "email", email }),
  });

  async function dumpWallet() {
    signer.exportWallet({
      iframeContainerId: TurnkeyExportWalletContainerId,
      iframeElementId: TurnkeyExportWalletElementId,
    })
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("bundle")) {
      // this will complete email auth
      signer
        .authenticate({ type: "email", bundle: urlParams.get("bundle")! })
        // redirect the user or do w/e you want once the user is authenticated
        .then(() => (window.location.href = "/"));

    }
  }, [signer]);

  // The below view allows you to collect the email from the user
  return (
    <>
      {!isLoading && (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => loginOrSignup(email)}>Submit</button>
          <button onClick={() => dumpWallet()}>Print Stuff</button>
        </div>
      )}
      <div
        className="w-full"
        style={{ display: "block" }}
        id={TurnkeyExportWalletContainerId}
      >
        <style>{iframeCss}</style>
      </div>
    </>
  );
};
