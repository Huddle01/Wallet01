import { useMutation } from 'react-query'
import { connectorName, connect as _connect, signMessage as _sign } from "@huddle01-wallets/multichain";


export const useMessage = () => {

    const { isLoading, isError, mutate } = useMutation(
        async ({connector, _chainId} : { connector: connectorName, _chainId: string }) => {
            await _sign(connector, _chainId)
        }
    )

    return {
        isLoading,
        isError,
        signMessage: ({connector, _chainId} : { connector: connectorName, _chainId: string }) => mutate({connector, _chainId})
    }
}