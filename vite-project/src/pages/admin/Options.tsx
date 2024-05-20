import LicenseCard from "@/components/CardLicense";
import CardClearDB from "@/components/CardClearDB";
export default function Options() {
    return (
      <div className="gap-7 flex flex-col justify-center lg:flex-row">
      <LicenseCard/>
      <CardClearDB/>
      </div>
    );
  }