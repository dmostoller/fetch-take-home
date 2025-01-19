import { http, HttpResponse, ResponseResolver } from "msw";

interface DogsResponse {
  dogs: Array<{ id: string; name: string; breed: string }>;
  total: number;
  next: string;
  prev: string;
}

interface Dog {
  id: string;
  name: string;
  breed: string;
}

interface MockDogsResponse {
  dogs: Dog[];
  total: number;
  next: string;
  prev: string;
}

interface GetDogsRequestParams {
  // Define any request parameters if needed
}

interface GetDogsResponse extends DogsResponse {}

export const handlers: Array<ReturnType<typeof http.get>> = [
  http.get<GetDogsRequestParams, GetDogsResponse>(
    "/api/dogs",
    async ({ request, params }) => {
      const mockResponse: MockDogsResponse = {
        dogs: [
          { id: "1", name: "Max", breed: "Golden Retriever" },
          { id: "2", name: "Luna", breed: "Labrador" },
        ],
        total: 2,
        next: "next-cursor",
        prev: "prev-cursor",
      };

      return res(mockResponse);
    },
  ),
];
const res = (json: any) => {
  return HttpResponse.json(json);
};
