import { useAccount } from "./AccountContext";

export default function Generic(){
    const { user } = useAccount();
    return(
        <>
                <div>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>GUID: {user?.guid}</p>
      </div>
        </>
    )
}