// src/app/(protected)/user-management/page.tsx

"use client";

import { useMemo, useState, useEffect } from "react";
import { ColumnDef, Table } from "@tanstack/react-table";
import { User } from "@/types/entities/users";
import { generateFakeUsers } from "@/lib/makeData";
import { AdvancedDataTable } from "@/components/data-table";
import { DataTableCheckBox } from "@/components/data-table/data-table-checkbox";
import { z } from "zod";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const tmo = setTimeout(() => {
      setUsers(generateFakeUsers(100));
      setIsLoading(false);
      clearTimeout(tmo);
    }, 1500);
  }, []);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }: { table: Table<User> }) => (
          <DataTableCheckBox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <DataTableCheckBox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        meta: {
          filterVariant: "select",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: {
          filterVariant: "select",
        },
      },
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
        meta: {
          filterVariant: "date",
        },
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <AdvancedDataTable<User>
        id="user-management-table"
        columns={columns}
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
        dataValidationProps={[
          {
            id: "firstName",
            component: "input",
            label: "First Name",
            schema: z.string().min(2, "First name is too short"),
          },
          {
            id: "lastName",
            component: "input",
            label: "Last Name",
            schema: z.string().min(2, "Last name is too short"),
          },
          {
            id: "email",
            component: "input",
            label: "Email",
            schema: z.string().email("Invalid email address"),
          },
          {
            id: "role",
            component: "select",
            label: "Role",
            data: [
              { value: "Admin", children: "Admin" },
              { value: "Organizer", children: "Organizer" },
              { value: "Judge", children: "Judge" },
              { value: "Mentor", children: "Mentor" },
              { value: "TeamLeader", children: "Team Leader" },
              { value: "TeamMember", children: "Team Member" },
            ],
            schema: z.enum([
              "Admin",
              "Organizer",
              "Judge",
              "Mentor",
              "TeamLeader",
              "TeamMember",
            ]),
          },
          {
            id: "status",
            component: "select",
            label: "Status",
            data: [
              { value: "Active", children: "Active" },
              { value: "Inactive", children: "Inactive" },
              { value: "Banned", children: "Banned" },
              { value: "Pending", children: "Pending" },
              { value: "Archived", children: "Archived" },
            ],
            schema: z.enum([
              "Active",
              "Inactive",
              "Banned",
              "Pending",
              "Archived",
            ]),
          },
        ]}
      />
    </div>
  );
}
