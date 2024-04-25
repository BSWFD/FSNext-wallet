import { useConnect, useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { normalize } from "viem/ens";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Account() {
  const { error } = useConnect();
  const { isConnected, address, connector } = useAccount();

  const ensName = useEnsName({
    address: address,
  });
  const ensAvatar = useEnsAvatar({
    name: normalize((ensName.data as string) ? (ensName.data as string) : ""),
  });

  return (
    <div className="my-3">
      {isConnected && <div className=" items-center justify-center flex flex-col">
        <Avatar className="w-[150px] h-[150px] mb-3 border ">
          <AvatarImage src={ ensAvatar.data ?? "./img/unknown-avatar.png" } alt="ensAvatar" />
          <AvatarFallback>No ENS Avatar</AvatarFallback>
        </Avatar>
        <span className="font-bold text-pink-500">
          {connector?.name} / {ensName.data ?? "No ENS Name"}
        </span>
      </div>}
      {error && <div>{error.message}</div>}
    </div>
  );
}
