import React, { createContext, useState, useContext, ReactNode } from "react";

export interface MicrosoftCalendarInterface {
  id: string;
  name: string;
  color: string;
}

interface MicrosoftCalendarContextType {
  microsoftCalendars: MicrosoftCalendarInterface[];
  setMicrosoftCalendar: React.Dispatch<React.SetStateAction<MicrosoftCalendarInterface[]>>;
}

const microsoftCalendarsContext = createContext<MicrosoftCalendarContextType | undefined>(undefined);

export const MicrosoftCalendarProvider = ({ children }: { children: ReactNode }) => {
  const [microsoftCalendars, setMicrosoftCalendar] = useState<MicrosoftCalendarInterface[]>([]);

  return (
    <microsoftCalendarsContext.Provider
      value={{
        microsoftCalendars,
        setMicrosoftCalendar
      }}
    >
      {children}
    </microsoftCalendarsContext.Provider>
  );
};

export const useMicrosoftCalendar = (): MicrosoftCalendarContextType => {
  const context = useContext(microsoftCalendarsContext);
  if (context === undefined) {
    throw new Error("useMicrosoftCalendar must be used within a UserPbxProvider");
  }
  return context;
};
