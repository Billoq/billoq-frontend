import Image from "next/image";

interface AboutCardProps {
  iconSrc: string;
  title: string;
  description: string;
}

export function AboutCard({ iconSrc, title, description }: AboutCardProps) {
  return (
    <div className="bg-[#00185D33] w-[380px] pb-20 backdrop-blur-md rounded-lg p-6 flex flex-col items-start gap-4 border border-[#2A3B5A66]">
      <div className=" mt-5 mb-5 rounded-full">
        <Image src={iconSrc} alt={title} width={24} height={24} />
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold uppercase">{title}</h3>
        <p className="text-gray-400 text-sm mt-4 w-[320px] ">{description}</p>
      </div>
    </div>
  );
}