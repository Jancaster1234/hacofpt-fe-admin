// src/app/(protected)/user-management/page.tsx

"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/entities/user";
import { generateFakeUsers } from "@/lib/data-generators/users";
import { AdvancedDataTable } from "@/components/data-table";
import { userColumns } from "./_config/columns";
import {
  addDataValidationProps,
  editDataValidationProps,
} from "./_config/validationConfig";
import {
  exportProps,
  actionProps,
  addDataProps,
  editDataProps,
  contextMenuProps,
} from "./_config/tableConfig";
import { DataTableStoreProvider } from "@/context/dataTableStoreProvider";
export default function UserManagementPage() {
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
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <DataTableStoreProvider isSelecting={false}>
        <AdvancedDataTable<User>
          id="user-management-table"
          columns={userColumns}
          data={users}
          isLoading={isLoading}
          exportProps={exportProps}
          actionProps={actionProps}
          addDataProps={addDataProps}
          editDataProps={editDataProps}
          addDataValidationProps={addDataValidationProps}
          editDataValidationProps={editDataValidationProps}
          contextMenuProps={contextMenuProps}
          onRowClick={(row) => console.log("Row clicked", row)}
        />
      </DataTableStoreProvider>
    </div>
  );
}
