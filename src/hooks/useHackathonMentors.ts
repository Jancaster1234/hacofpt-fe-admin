// src/hooks/useHackathonMentors.ts
import { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import { userHackathonService } from "@/services/userHackathon.service";

export function useHackathonMentors(hackathonId: string) {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        // Adjust this endpoint to match your actual API
        const response = await userHackathonService.getUserHackathonsByRole(
          hackathonId,
          "MENTOR"
        );

        if (response && response.data) {
          setMentors(response.data);
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
