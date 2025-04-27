// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamInfo.tsx
import { Team } from "@/types/entities/team";

interface TeamInfoProps {
  team: Team;
}

export function TeamInfo({ team }: TeamInfoProps) {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-md">
      <h4 className="font-semibold mb-2">Team Information</h4>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Team Leader:</span>{" "}
        {team.teamLeader.firstName} {team.teamLeader.lastName} (
        {team.teamLeader.email})
      </p>

      {team.teamMembers && team.teamMembers.length > 0 && (
        <div className="mt-2">
          <p className="font-medium text-sm">Team Members:</p>
          <ul className="pl-5 list-disc text-sm text-gray-700">
            {team.teamMembers
              .filter((member) => member.user.id !== team.teamLeader.id)
              .map((member) => (
                <li key={member.id}>
                  {member.user.firstName} {member.user.lastName} (
                  {member.user.email})
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/TeamInfo.tsx
// import { Team } from "@/types/entities/team";

// interface TeamInfoProps {
//   team: Team;
// }

// export function TeamInfo({ team }: TeamInfoProps) {
//   return (
//     <div className="mt-4 mb-2 p-3 bg-gray-50 rounded-md">
//       <h4 className="font-medium mb-2">Team Members</h4>
//       <div className="space-y-2">
//         {/* Team Leader */}
//         {team.teamLeader && (
//           <div className="flex items-center">
//             <div className="w-20 text-sm text-gray-500">Leader:</div>
//             <div className="text-sm font-medium">
//               {team.teamLeader.firstname} {team.teamLeader.lastname}{" "}
//               <span className="text-xs text-gray-500">({team.teamLeader.email})</span>
//             </div>
//           </div>
//         )}

//         {/* Team Members */}
//         {team.teamMembers && team.teamMembers.length > 0 && (
//           <>
//             {team.teamMembers
//               .filter((member) => member.user.id !== team.teamLeader?.id)
//               .map((member) => (
//                 <div key={member.id} className="flex items-center">
//                   <div className="w-20 text-sm text-gray-500">Member:</div>
//                   <div className="text-sm">
//                     {member.user.firstname} {member.user.lastname}{" "}
//                     <span className="text-xs text-gray-500">({member.user.email})</span>
//                   </div>
//                 </div>
//               ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/LatestSubmission.tsx
// import { Submission } from "@/types/entities/submission";

// interface LatestSubmissionProps {
//   submissions: Submission[];
//   showPopup: (type: string, id: string, note: string) => void;
// }

// export function LatestSubmission({ submissions, showPopup }: LatestSubmissionProps) {
//   // Find the latest submitted submission
//   const latestSubmission = [...submissions]
//     .filter((submission) => submission.status === "SUBMITTED" && submission.submittedAt)
//     .sort(
//       (a, b) =>
//         new Date(b.submittedAt || "").getTime() - new Date(a.submittedAt || "").getTime()
//     )[0];

//   if (!latestSubmission) {
//     return (
//       <div className="mt-3 p-3 border border-gray-200 rounded-md">
//         <p className="text-sm text-gray-500">No submissions yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-3 p-3 border border-gray-200 rounded-md">
//       <h4 className="font-medium mb-2">Latest Submission</h4>
//       <div className="flex flex-wrap gap-y-2">
//         <div className="w-full sm:w-1/2">
//           <div className="text-sm text-gray-500">Title:</div>
//           <div className="text-sm font-medium">{latestSubmission.title}</div>
//         </div>
//         <div className="w-full sm:w-1/2">
//           <div className="text-sm text-gray-500">Status:</div>
//           <div className="text-sm font-medium">{latestSubmission.status}</div>
//         </div>
//         <div className="w-full sm:w-1/2">
//           <div className="text-sm text-gray-500">Submitted by:</div>
//           <div className="text-sm font-medium">
//             {latestSubmission.createdBy?.firstname} {latestSubmission.createdBy?.lastname}
//           </div>
//         </div>
//         <div className="w-full sm:w-1/2">
//           <div className="text-sm text-gray-500">Submitted at:</div>
//           <div className="text-sm font-medium">
//             {latestSubmission.submittedAt
//               ? new Date(latestSubmission.submittedAt).toLocaleString()
//               : "N/A"}
//           </div>
//         </div>
//         <div className="w-full sm:w-1/2">
//           <div className="text-sm text-gray-500">Final Score:</div>
//           <div className="text-sm font-medium">
//             {latestSubmission.finalScore !== undefined && latestSubmission.finalScore !== null
//               ? latestSubmission.finalScore.toFixed(1)
//               : "Not scored"}
//           </div>
//         </div>

//         {latestSubmission.note && (
//           <div className="w-full mt-2">
//             <button
//               className="text-sm text-blue-600 hover:underline"
//               onClick={() => showPopup("submission", latestSubmission.id, latestSubmission.note)}
//             >
//               View submission notes
//             </button>
//           </div>
//         )}

//         {latestSubmission.submissionUrl && (
//           <div className="w-full mt-2">
//             <a
//               href={latestSubmission.submissionUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-blue-600 hover:underline"
//             >
//               View submission
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/AllSubmissions.tsx
// import { Submission } from "@/types/entities/submission";

// interface AllSubmissionsProps {
//   submissions: Submission[];
// }

// export function AllSubmissions({ submissions }: AllSubmissionsProps) {
//   const sortedSubmissions = [...submissions]
//     .filter(submission => submission.submittedAt)
//     .sort(
//       (a, b) =>
//         new Date(b.submittedAt || "").getTime() - new Date(a.submittedAt || "").getTime()
//     );

//   if (sortedSubmissions.length === 0) {
//     return (
//       <div className="mt-3 p-3 border border-gray-200 rounded-md">
//         <p className="text-sm text-gray-500">No submissions available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-3 p-3 border border-gray-200 rounded-md">
//       <h4 className="font-medium mb-2">All Submissions</h4>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Submitted By
//               </th>
//               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Score
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {sortedSubmissions.map((submission) => (
//               <tr key={submission.id}>
//                 <td className="px-3 py-2 whitespace-nowrap text-sm">
//                   {submission.submissionUrl ? (
//                     <a
//                       href={submission.submissionUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       {submission.title}
//                     </a>
//                   ) : (
//                     submission.title
//                   )}
//                 </td>
//                 <td className="px-3 py-2 whitespace-nowrap text-sm">
//                   {submission.createdBy
//                     ? `${submission.createdBy.firstname} ${submission.createdBy.lastname}`
//                     : "Unknown"}
//                 </td>
//                 <td className="px-3 py-2 whitespace-nowrap text-sm">
//                   {submission.submittedAt
//                     ? new Date(submission.submittedAt).toLocaleString()
//                     : "Not submitted"}
//                 </td>
//                 <td className="px-3 py-2 whitespace-nowrap text-sm">
//                   {submission.status}
//                 </td>
//                 <td className="px-3 py-2 whitespace-nowrap text-sm">
//                   {submission.finalScore !== undefined && submission.finalScore !== null
//                     ? submission.finalScore.toFixed(1)
//                     : "Not scored"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
