import React, { ReactElement, ReactNode } from "react";
import { render, RenderResult } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderType,
} from "@tanstack/react-query";

interface RenderWithClientResult extends RenderResult {
  testQueryClient: QueryClient;
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

export function renderWithClient(ui: ReactElement): RenderWithClientResult {
  const testQueryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProviderType client={testQueryClient}>
      {children}
    </QueryClientProviderType>
  );

  const renderResult = render(ui, { wrapper: Wrapper });
  return {
    ...renderResult,
    testQueryClient,
  };
}

export const searchDogs = async (params: URLSearchParams) => {
  const response = await fetch(`/api/dogs?${params}`);
  if (!response.ok) throw new Error("Failed to fetch dogs");
  return response.json();
};
