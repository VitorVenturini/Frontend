import { useState, useEffect } from "react";
import APIOpenAICard from "./ApiOpenAI/APIOpenAICard";
import APIGoogleCard, { APIGoogleCalendarCard } from "./ApiGoogle/APIGoogleCard";
import APIFlicCard from "./ApiFlic/APIFlicCard";
import { useWebSocketData } from "../../websocket/WebSocketProvider";


export default function APIsOption() {
    const wss = useWebSocketData();

    const handleGoogleApiStatus = () => {

        // Aqui está a simulação da mensagem sendo enviada.
        wss?.sendMessage({
        api: "admin",
        mt: "RequestGoogleOAuthStatus",
        });
    };
    // Chamada automática do `handleGoogleApiStatus` ao carregar o componente
    useEffect(() => {
        handleGoogleApiStatus();
    }, []);
    return (
        <div className="flex justify-center fex-col items-start w-full">
            <div className="flex flex-col gap-2 space-y-2 w-[100%] items-center justify-center">
                <APIGoogleCard />
                <APIGoogleCalendarCard/>
                <APIOpenAICard />
                <APIFlicCard />
            </div>
        </div>
    )
}