// src/app/hackathon/_components/HackathonList.tsx
import HackathonCard from "@/components/HackathonCard";
import { Hackathon } from "@/types/entities/hackathon";

// TODO: {Lv2} Instead of hardcoding the grid layout inside HackathonList.tsx, pass the pass the number value as a prop
type HackathonListProps = {
  hackathons: Hackathon[];
};

export default function HackathonList({ hackathons }: HackathonListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id} hackathon={hackathon} />
      ))}
    </div>
  );
}
