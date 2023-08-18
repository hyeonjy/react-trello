import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { darkTheme } from "./theme";
import { RecoilRoot } from "recoil";
import { createGlobalStyle, styled } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./Fonts/Font.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>
);
