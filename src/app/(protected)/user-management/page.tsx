// src/app/(protected)/user-management/page.tsx
import DataTable from "@/components/DataTable";

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Editor" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "User" },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
      <DataTable data={users} />
    </div>
  );
}
