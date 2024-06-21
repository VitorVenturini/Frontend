import LicenseCard from "@/components/license/CardLicense";
import CardClearDB from "@/components/options/clearDB/CardClearDB";
export default function Options() {
    return (
      <div className="gap-7 flex flex-col justify-center lg:flex-row">
      <LicenseCard/>
      <CardClearDB/>
      </div>
    );
  }