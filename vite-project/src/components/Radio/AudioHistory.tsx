import React, { useEffect, useState } from "react";

const AudioHistory = ({ messages, userGuid }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {messages.map((message) => {
        const isSent = message.senderGuid === userGuid; // Verifica se é enviado
        return (
          <div
            key={message.id}
            style={{
              display: "flex",
              justifyContent: isSent ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: isSent ? "#DCF8C6" : "#FFFFFF",
                padding: "8px 12px",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <audio src={message.audioUrl} controls />
            </div>
          </div>
        );
      })}
    </div>
  );
};

