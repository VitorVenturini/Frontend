import React, { createContext, useState, useContext, ReactNode } from "react";

export interface GoogleCalendarInterface {
  id: string;
  summary: string;
  backgroudColor: string;
}

interface GoogleCalendarContextType {
  googleCalendars: GoogleCalendarInterface[];
  setGoogleCalendar: React.Dispatch<React.SetStateAction<GoogleCalendarInterface[]>>;
}

const googleCalendarsContext = createContext<GoogleCalendarContextType | undefined>(undefined);

export const GoogleCalendarProvider = ({ children }: { children: ReactNode }) => {
  const [googleCalendars, setGoogleCalendar] = useState<GoogleCalendarInterface[]>([]);

  return (
    <googleCalendarsContext.Provider
      value={{
        googleCalendars,
        setGoogleCalendar
      }}
    >
      {children}
    </googleCalendarsContext.Provider>
  );
};

export const useGoogleCalendar = (): GoogleCalendarContextType => {
  const context = useContext(googleCalendarsContext);
  if (context === undefined) {
    throw new Error("useGoogleCalendar must be used within a UserPbxProvider");
  }
  return context;
};
