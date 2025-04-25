import Image from "next/image";

interface FeatureCardProps {
  iconSrc: string;
  title: string;
  description: string;
}

export function FeatureCard({ iconSrc, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#1A2A44] rounded-lg p-6 flex flex-col items-start gap-4 w-360px border border-[#396294] hover:border-blue-500 transition duration-300">
      <div className="bg-[#2A3B5A] p-3 rounded-lg mb-12">
        <Image src={iconSrc} alt={title} width={38} height={38} />
      </div>
      <div>
        <h3 className="text-white text-lg mb-4 font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}