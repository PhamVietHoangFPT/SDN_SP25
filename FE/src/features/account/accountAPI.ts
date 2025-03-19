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
        getAccountDetail: build.query({
            query: (id) => ({
                url: `/accounts/${id}`,
                method: 'GET',
            }),
            transformResponse: (res) => res,
            providesTags: ['account'],
        }),
        updateAccount: build.mutation({
            query: ({ id, data }) => ({
                url: `/accounts/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (res) => res,
            invalidatesTags: ['account'],
        }),
        addAccount: build.mutation({
            query: (data) => ({
                url: '/accounts',
                method: 'POST',
                body: data,
            }),
            transformResponse: (res) => res,
            invalidatesTags: ['account'], // Invalidate the 'category' tag to refetch the list
        }),
    }),
})

export const {
    useGetAccountListQuery,
    useGetAccountDetailQuery,
    useUpdateAccountMutation,
    useAddAccountMutation
} = AccountApi
