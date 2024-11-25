import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
import { useAppConfig } from "../options/ConfigContext";
interface OptMapProps {
  clickedButton: ButtonInterface;
}

export default function OptMap({ clickedButton }: OptMapProps) {
  const { googleApiKeyInfo } = useAppConfig();
  const filteredGoogleAPI = googleApiKeyInfo.filter((key) => {
    return key.entry === "googleApiKey";
  })[0];
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${filteredGoogleAPI.value}&q=${clickedButton.button_prt}&zoom=14&maptype=roadmap`;
  return (
    <Card className="h-full">
      <div className="h-full w-full relative">
        <iframe
          width="100%"
          height="100%"
          className="h-full "
          frameBorder="0"
          src={googleMapsUrl}
          allowFullScreen
        ></iframe>
      </div>
    </Card>
  );
}
