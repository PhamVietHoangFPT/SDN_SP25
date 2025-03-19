import { apiSlice } from '../../apis/apiSlice'

export const AccountApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAccountList: build.query({
            query: ({ pageNumber, pageSize, sort, name }) => ({
                url: '/category',
                method: 'GET',
                params: {
                    pageNumber,
                    pageSize,
                    sort,
                    name,
                },
            }),
            transformResponse: (res) => res,
            providesTags: ['category'],
        }),
    }),
})

export const {
    useGetAccountListQuery
} = AccountApi
