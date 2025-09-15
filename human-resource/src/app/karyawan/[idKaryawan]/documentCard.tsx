"use client";
import Image from "next/image";

const DocumentCard: React.FC<{
  imageSrc: string;
  altText: string;
  label: string;
}> = ({ imageSrc, altText, label }) => (
  <div className="flex flex-col items-center h-auto">
    <div className="flex flex-grow items-center justify-center">
      <a href={imageSrc} target="_blank" rel="noopener noreferrer">
        <Image
          src={imageSrc}
          alt={altText}
          width={100}
          height={100}
          className="w-full h-auto px-4"
        />
      </a>
    </div>
    <div className="p-4 flex items-center justify-center">
      <p className="text-center">{label}</p>
    </div>
  </div>
);

export default DocumentCard;
