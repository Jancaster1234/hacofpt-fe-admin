// src/app/(protected)/user-management/page.tsx

"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/entities/users";
import { generateFakeUsers } from "@/lib/data-generators/users";
import { AdvancedDataTable } from "@/components/data-table";
import { userColumns } from "@/components/columns/users";
import { userDataValidationProps } from "./validationConfig";
import {
  exportProps,
  actionProps,
  addDataProps,
  editDataProps,
  contextMenuProps,
} from "./tableConfig";

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
      <AdvancedDataTable<User>
        id="user-management-table"
        columns={userColumns}
        data={users}
        isLoading={isLoading}
        exportProps={exportProps}
        actionProps={actionProps}
        addDataProps={addDataProps}
        editDataProps={editDataProps}
        dataValidationProps={userDataValidationProps}
        contextMenuProps={contextMenuProps}
        onRowClick={(row) => console.log("Row clicked", row)}
      />
    </div>
  );
}
