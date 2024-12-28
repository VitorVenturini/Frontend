import React from "react";
import CardNotificationSensor from "./CardNotificationSensor";
import CardNotificationChat from "./CardNotificationChat";
import CardNotificationAlarm from "./CardNotificationAlarm";
import SMTPconfig from "../SMTPconfig";
import AwsSmsConfig from "../SMSAwsConfig"; // Importação da terceira aba
import texts from "@/_data/texts.json";
import { useLanguage } from "@/components/language/LanguageContext";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function Notify() {
  const { language } = useLanguage();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="w-full bg-accent text-accent-foreground">
      {/* Tabs */}
      <Box sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab
            label={texts[language].labelSons}
            sx={{ color: "var(--text-accent-foreground)" }}
          />
          <Tab
            label={texts[language].labelEmail}
            sx={{ color: "var(--text-accent-foreground)" }}
          />
          <Tab
            label={texts[language].labelSms}
            sx={{ color: "var(--text-accent-foreground)" }}
          />
        </Tabs>
      </Box>

      {/* Conteúdo Condicional */}
      <Box sx={{ padding: 2 }}>
        {value === 0 && (
          <div className="flex flex-row">
            <CardNotificationSensor />
            <CardNotificationChat />
            <CardNotificationAlarm />
          </div>
          
        )}

        {value === 1 && (
          <div>
            <SMTPconfig />
          </div>
        )}

        {value === 2 && (
          <div>
            <AwsSmsConfig />
          </div>
        )}
      </Box>
    </div>
  );
}
