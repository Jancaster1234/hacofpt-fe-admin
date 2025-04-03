// src/services/mentorTeam.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorTeam } from "@/types/entities/mentorTeam";

class MentorTeamService {
    async getMentorTeamsByHackathonAndTeam(hackathonId: string, teamId: string): Promise<MentorTeam[]> {
        try {
          const response = await apiService.auth.post<MentorTeam[]>(
            "/hackathon-service/api/v1/mentor-teams/filter-by-hackathon-and-team",
            {
              data: {
                hackathonId: hackathonId,
                teamId: teamId,
              }
            }
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching mentorTeams by hackathonId and teamId:", error);
          throw error;
        }
      }

      async getMentorTeamsByMentorId(mentorId: string): Promise<MentorTeam[]> {
        try {
          const response = await apiService.auth.post<MentorTeam[]>(
            "/hackathon-service/api/v1/mentor-teams/filter-by-mentor",
            {
              data: mentorId
            }
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching mentorTeams by mentorId:", error);
          throw error;
        }
      }
  }
export const mentorTeamService = new MentorTeamService();
