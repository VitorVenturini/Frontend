import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGoogleApiKey } from "../options/ApiGoogle/GooglApiContext";
import { ButtonInterface } from "@/components/buttons/buttonContext/ButtonsContext";
interface OptMapProps {
  clickedButton: ButtonInterface;
}

export default function OptMap({ clickedButton }: OptMapProps) {
  const { apiKeyInfo } = useGoogleApiKey();
  const filteredGoogleAPI = apiKeyInfo.filter((key) => {
    return key.entry === "googleApiKey";
  })[0];
  const googleMapsUrl = `
  https://www.google.com/maps/embed/v1/view?key=${filteredGoogleAPI.value}&center=${clickedButton.button_prt}&zoom=14&maptype=roadmap`;
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
