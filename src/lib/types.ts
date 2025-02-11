export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: "breed:asc" | "breed:desc";
}

export interface DogsResponse {
  dogs: Dog[];
  total: number;
  next?: string;
  prev?: string;
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface MatchResponse {
  match: string;
}

export interface LoginCredentials {
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface PaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
}

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  location?: string;
  sort?: "breed:asc" | "breed:desc";
}
export interface LocationSearchParams {
  city?: string;
  states?: string[];
  size?: number;
}

export interface Location {
  city: string;
  state: string;
  zip_code: string;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

export interface MatchmakerSelections {
  location: string;
  breeds: string[];
  ageRange: "young" | "adult" | "senior" | "";
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface AIMatchmakerFunctions {
  searchDogs: (params: MatchmakerSelections) => Promise<SearchResponse>;
  getBreeds: () => Promise<string[]>;
  generateMatch: (dogIds: string[]) => Promise<MatchResponse>;
}
