import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDogs } from "../useDogs";

describe("useDogs", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient.clear();
  });

  it("fetches dogs with given parameters", async () => {
    const params = {
      breeds: ["Labrador"],
      sort: "breed:asc" as const,
      size: 20,
      from: 0,
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            dogs: [{ id: "1", name: "Max", breed: "Labrador" }],
            total: 1,
          }),
      }),
    );

    const { result } = renderHook(() => useDogs(params), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.dogs).toBeDefined();
      expect(result.current.data?.dogs[0].name).toBe("Max");
    });
  });
});
