import Image from "next/image";

interface ServiceCardProps {
  iconSrc: string;
  title: string;
}

export function ServiceCard({ iconSrc, title }: ServiceCardProps) {
  return (
    <div className="bg-[#2A3B5A] rounded-lg p-4 flex flex-col items-center gap-2">
      <Image src={iconSrc} alt={title} width={24} height={24} />
      <span className="text-white text-sm">{title}</span>
    </div>
  );
}