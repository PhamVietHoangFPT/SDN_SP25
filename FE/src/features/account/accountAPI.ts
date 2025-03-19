import { apiSlice } from '../../apis/apiSlice'

export const AccountApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAccountList: build.query({
            query: ({ pageNumber, pageSize, username }) => ({
                url: '/accounts',
                method: 'GET',
                params: {
                    pageNumber,
                    pageSize,
                    username,
                },
            }),
            transformResponse: (res) => res,
            providesTags: ['account'],
        }),
    }),
})

export const {
    useGetAccountListQuery
} = AccountApi
