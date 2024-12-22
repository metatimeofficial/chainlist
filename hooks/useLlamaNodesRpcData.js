import { useMemo } from "react";

import { llamaNodesRpcs } from "../constants/llamaNodesRpcs";
import { arrayMove } from "../utils/fetch";

export const useLlamaNodesRpcData = (chainId, data) => {
  const [rpcData, hasLlamaNodesRpc] = useMemo(() => {
    const llamaNodesRpc = llamaNodesRpcs[chainId] ?? null;

    if (llamaNodesRpc) {
      const llamaNodesRpcIndex = data.findIndex(rpc => rpc?.data.url === llamaNodesRpc.rpcs[0].url);

      if (llamaNodesRpcIndex || llamaNodesRpcIndex === 0) {
        return [arrayMove(data, llamaNodesRpcIndex, 0), true];
      }

      return [data, false];
    }

    return [data, false];
  }, [chainId, data]);

  return { rpcData, hasLlamaNodesRpc };
}
