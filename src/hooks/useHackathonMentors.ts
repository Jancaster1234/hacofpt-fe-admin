import { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import { userHackathonService } from "@/services/userHackathon.service";
import { UserHackathon } from "@/types/entities/userHackathon";

export function useHackathonMentors(hackathonId: string) {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const response = await userHackathonService.getUserHackathonsByRole(
          hackathonId,
          "MENTOR"
        );

        if (response && response.data) {
          const users = response.data
            .map((uh: UserHackathon) => uh.user)
            .filter((user): user is User => Boolean(user)); // filter out undefined/null
          setMentors(users);
        } else {
          setError("Failed to load mentors");
        }
      } catch (err) {
        console.error("Error fetching hackathon mentors:", err);
        setError("An error occurred while fetching mentors");
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId) {
      fetchMentors();
    }
  }, [hackathonId]);

  return { mentors, loading, error };
}
