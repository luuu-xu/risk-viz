import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CsvRecord } from "@/app/types";
import { getBaseUrl } from '@/app/lib/getBaseUrl';

export const dataApi = createApi({
  reducerPath: "dataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/get-json-data`,
  }),
  endpoints: (builder) => ({
    getData: builder.query<CsvRecord[], null>({
      query: () => '/',
    }),
  }),
});

export const { useGetDataQuery } = dataApi;