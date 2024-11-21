import APIOpenAICard from "./ApiOpenAI/APIOpenAICard";
import APIGoogleCard from "./ApiGoogle/APIGoogleCard";

export default function APIsOption() {
    return (
        <div className="flex justify-center fex-col items-start w-full">
            <div className="flex flex-col gap-2 space-y-2 w-[100%] items-center justify-center">
                <APIGoogleCard />
                <APIOpenAICard />
            </div>
        </div>
    )
}