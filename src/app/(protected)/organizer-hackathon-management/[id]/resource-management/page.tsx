// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/page.tsx
export default async function ResourceManagementPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const res = await fetch(`http://localhost:4000/api/hackathon/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch hackathon data");
  const hackathon = await res.json();

  return (
    <div>
      <h1>Resource Management</h1>
      <p>Hackathon Title: {hackathon.title}</p>
      <p>Current Enrollment: {hackathon.enrollmentCount}</p>
    </div>
  );
}
