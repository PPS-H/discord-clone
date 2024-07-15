import { UploadDropzone } from "@/lib/upload-thing";
import Image from "next/image";
import { X } from "lucide-react";

interface fileUploadProps {
  endpoint: "imageUploader";
  value: String;
  onChange: (url?: String) => void;
}

const FileUpload = ({ endpoint, value, onChange }: fileUploadProps) => {
  const fileType = value.split(".").pop();
  if (value) {
    // console.log("value of image is :::", value, fileType);
    return (
      <div className="relative mx-auto h-20 w-20">
        <Image
          fill
          alt="server image"
          src={value as string}
          className="rounded-full"
        />
        <button type="button" onClick={() => onChange("")}>
          <X className="absolute text-white bg-red-700 top-0 right-0 rounded-full w-[20px] h-[20px]" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res[0].url)}
      onUploadError={(error: Error) => {
        console.log(`ERROR! ${error.message}`);
      }}
    />
  );
};

export default FileUpload;
