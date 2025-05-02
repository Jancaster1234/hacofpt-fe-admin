// src/app/[locale]/(protected)/profile/_components/AwardTab.tsx
import { User } from "@/types/entities/user";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MedalIcon = ({ placement }: { placement: number }) => {
  const color = placement === 1 ? "#FFD700" : placement === 2 ? "#C0C0C0" : "#CD7F32";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      className="w-12 h-12"
    >
      <path d="M12 1v4.286a7 7 0 1 1-7 7h4.286a2.714 2.714 0 1 0 2.714-2.714V1Z" />
      <path fillOpacity={0.5} d="M12 1v4.286a7 7 0 1 0 7 7h-4.286a2.714 2.714 0 1 1-2.714-2.714V1Z" />
    </svg>
  );
};

interface AwardTabProps {
  user: User;
}

const AwardTab: React.FC<AwardTabProps> = ({ user }) => {
  const placementCounts: { [placement: number]: number } = {};
  const hackathonAwards: Array<{
    hackathonTitle: string;
    placement: number;
    role: string;
  }> = [];

  (user.userHackathons || []).forEach((userHackathon) => {
    if (userHackathon.role === "PARTICIPANT" && userHackathon.hackathon) {
      const result = userHackathon.hackathon.hackathonResults?.[0];
      if (result?.placement) {
        placementCounts[result.placement] = (placementCounts[result.placement] || 0) + 1;
        hackathonAwards.push({
          hackathonTitle: userHackathon.hackathon.title || 'Untitled Hackathon',
          placement: result.placement,
          role: userHackathon.role
        });
      }
    }
  });

  if (hackathonAwards.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-32 h-32 mb-4 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Awards Yet
            </h3>
            <p className="text-gray-500 max-w-sm">
              Participate in hackathons to earn awards and recognition!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Summary Grid */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Awards Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[1, 2, 3].map((placement) => (
              <div
                key={placement}
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-primary/50 transition-colors"
              >
                <div className="mb-2">
                  <MedalIcon placement={placement} />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {placementCounts[placement] || 0}
                </span>
                <span className="text-sm text-gray-500">
                  {placement === 1 ? "1st" : placement === 2 ? "2nd" : "3rd"} Place
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed List */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Award Details</h3>
          <div className="space-y-4">
            {hackathonAwards.map((award, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{award.hackathonTitle}</h4>
                  <span className="text-sm text-gray-500">{award.role}</span>
                </div>
                <Badge className={`font-medium ${award.placement === 1 ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400" :
                  award.placement === 2 ? "bg-gray-100 text-gray-800 border-2 border-gray-400" :
                    award.placement === 3 ? "bg-orange-100 text-orange-800 border-2 border-orange-400" :
                      "bg-blue-100 text-blue-800"
                  }`}>
                  {award.placement === 1 ? "1st Place 🏆" :
                    award.placement === 2 ? "2nd Place 🥈" :
                      award.placement === 3 ? "3rd Place 🥉" :
                        `${award.placement}th Place`}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AwardTab;