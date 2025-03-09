// src/components/HackathonCard/index.tsx
import Link from "next/link";
import Image from "next/image";
import { Hackathon } from "@/types/entities/hackathon";

type HackathonCardProps = {
  hackathon: Hackathon;
};

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <Link
      href={`/hackathon/${hackathon.id}`}
      className="block bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105"
    >
      <div className="relative w-full h-48">
        <Image
          src={hackathon.bannerImageUrl}
          alt={hackathon.title}
          fill
          className="object-cover rounded-t-lg"
          priority
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold">{hackathon.title}</h3>
        <p className="text-sm text-gray-500">{hackathon.subtitle}</p>
        <p className="text-sm text-gray-700">{hackathon.description}</p>
        <p className="text-xs text-gray-500 mt-2">
          Enroll: {hackathon.enrollStartDate} - {hackathon.enrollEndDate}
        </p>
      </div>
    </Link>
  );
}
