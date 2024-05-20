"use client";

import { AlchemyClientState } from "@alchemy/aa-alchemy/config";
import { AlchemyAccountProvider } from "@alchemy/aa-alchemy/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";
import { config, queryClient } from "./config";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export const Providers = (
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) => {
  return (
    <Suspense>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AlchemyAccountProvider
            config={config}
            queryClient={queryClient}
            initialState={props.initialState}
          >
            {props.children}
          </AlchemyAccountProvider>
        </QueryClientProvider>
      </Provider>
    </Suspense>
  );
};
