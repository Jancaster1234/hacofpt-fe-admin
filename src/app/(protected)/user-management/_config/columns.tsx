// src/app/(protected)/user-management/_config/columns.tsx
import { ColumnDef, Table } from "@tanstack/react-table";
import { User } from "@/types/entities/users";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { DataTableCheckBox } from "@/components/data-table/data-table-checkbox";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }: { table: Table<User> }) => (
      <div className="pt-1">
        <DataTableCheckBox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="pt-1">
        <DataTableCheckBox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
    size: 50,
  },
  {
    id: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <Avatar>
        <img
          src={row.original.avatarUrl || "/default-avatar.png"}
          alt="Avatar"
        />
      </Avatar>
    ),
    enableSorting: false,
    size: 50,
  },
  {
    accessorKey: "firstName",
    id: "firstName",
    header: "First Name",
    cell: ({ row }) => <span>{row.original.firstName}</span>,
  },
  {
    accessorKey: "lastName",
    id: "lastName",
    header: "Last Name",
    cell: ({ row }) => <span>{row.original.lastName}</span>,
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-blue-600">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "role",
    id: "role",
    header: "Role",
    cell: ({ row }) => <Badge>{row.original.role}</Badge>,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor = {
        Active: "green",
        Inactive: "gray",
        Banned: "red",
        Pending: "yellow",
        Archived: "blue",
      }[row.original.status || "Inactive"];
      return <Badge color={statusColor}>{row.original.status}</Badge>;
    },
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "birthdate",
    id: "birthdate",
    header: "Birthdate",
    cell: ({ row }) =>
      row.original.birthdate
        ? format(new Date(row.original.birthdate), "yyyy-MM-dd")
        : "-",
    meta: {
      filterVariant: "date",
    },
  },
  {
    accessorKey: "phone",
    id: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.original.phone || "-"}</span>,
  },
  {
    accessorKey: "skills",
    id: "skills",
    header: "Skills",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.skills?.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        )) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "experienceLevel",
    id: "experienceLevel",
    header: "Experience",
    cell: ({ row }) => <span>{row.original.experienceLevel || "-"}</span>,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString()
        : "-",
    meta: {
      filterVariant: "date",
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="p-1 text-blue-500 hover:underline">Edit</button>
        </TooltipTrigger>
        <TooltipContent>Edit User</TooltipContent>
      </Tooltip>
    ),
    enableSorting: false,
  },
];
