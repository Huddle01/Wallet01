import React, { FunctionComponent } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



interface Props {
    children: JSX.Element
}

const Wallet01: FunctionComponent<Props> = ({ children }) => {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default Wallet01;