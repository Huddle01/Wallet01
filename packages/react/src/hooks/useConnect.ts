import { connectorName, connect as _connect, getAccount, resolveDid, disconnect } from "@huddle01-wallets/multichain";
import { useAtom } from "jotai";
import { account, did, connected, chainId } from "../store/atoms"
import { useMutation } from 'react-query'

export const useConnect = () => {
    const [isActive, setIsActive] = useAtom(connected)
    const [address, setAddress] = useAtom(account)
    const [name, setName] = useAtom(did)
    const [ activeChain ,] = useAtom(chainId)
    // const [ value, connect ] = useAtom(connectLoadable)



    const { isLoading, isError, mutate } = useMutation(
        async ({connector, _chainId} : { connector: connectorName, _chainId: string }) => {
            await _connect(connector, _chainId)
            setIsActive(true)

            const _account = await getAccount(connector)
            setAddress(_account[0])

            const _did = await resolveDid(connector, _account[0])
            setName(_did)
        }
    )

    return {
        isActive,
        address,
        name,
        activeChain,
        isLoading,
        isError,
        connect : ({connector, _chainId}: { connector: connectorName, _chainId: string }) => mutate({connector, _chainId}),
        disconnect
    }
}
