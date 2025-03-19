// src/app/(protected)/user-management/page.tsx

"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/entities/users";
import { generateFakeUsers } from "@/lib/data-generators/users";
import { AdvancedDataTable } from "@/components/data-table";
import { userColumns } from "@/components/columns/users";
import { DataTableStoreProvider } from "@/context/dataTableStoreProvider";
export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading
    const tmo = setTimeout(() => {
      setUsers(generateFakeUsers(500));
      setIsLoading(false);
      clearTimeout(tmo);
    }, 1500);
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <DataTableStoreProvider isSelecting={false}>
        <AdvancedDataTable<User>
          id="user-management-table"
          columns={userColumns}
          data={users}
          isLoading={isLoading}
          exportProps={{
            exportFileName: "users-export",
          }}
          actionProps={{
            onDelete: (selected) => console.log("Delete Users", selected),
          }}
          onRowClick={(row) => console.log("Row clicked", row)}
          addDataProps={{
            enable: true,
            title: "Add User",
            description: "Fill the user details below.",
            onSubmitNewData: (newUser) => console.log("New user", newUser),
          }}
          editDataProps={{
            title: "Edit User",
            description: "Modify the user data below.",
            onSubmitEditData: (editedUser) =>
              console.log("Edited user", editedUser),
          }}
          contextMenuProps={{
            enableEdit: true,
            enableDelete: true,
            onDelete: (data) => console.log("Context delete", data),
          }}
        />
      </DataTableStoreProvider>
    </div>
  );
}
