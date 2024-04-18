import { Badge } from "./ui/badge";

import { botsManagementRows } from "@/data/data";

import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "./DataTable";
import { Button } from "./ui/button";

export type Bots = {
    id: number,
    name: string,
    category: string,
    status: 'active' | 'draft' | 'archived',
    last_activity: string,
    dummy: string,
    dummy_two: string,
    dummy_three: string
}

const renderColumnHeader = (column: Column<Bots, unknown>, columnName: string) => {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {columnName}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}

const columns: ColumnDef<Bots>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => renderColumnHeader(column, "Name"),
    },
    {
        accessorKey: "category",
        filterFn: (row: Row<any>, columnId: string, filterValue: any): boolean => {
            const rowValue = row.getValue(columnId);
            const result = (filterValue && Array.isArray(filterValue) && filterValue.length > 0) ? filterValue.includes(rowValue) : true;
            return result;
        },
        header: ({ column }) => renderColumnHeader(column, "Category"),
    },
    {
        accessorKey: "status",
        header: ({ column }) => renderColumnHeader(column, "Status"),
        filterFn: (row: Row<any>, columnId: string, filterValue: any): boolean => {
            const rowValue = row.getValue(columnId);
            const result = (filterValue && Array.isArray(filterValue) && filterValue.length > 0) ? filterValue.includes(rowValue) : true;
            return result;
        },
        cell: ({ row }) => {
            return <StatusBadge status={row.getValue("status")} />
        },
    },
    {
        accessorKey: "last_activity",
        header: ({ column }) => renderColumnHeader(column, "Last activity"),
    },
    {
        accessorKey: "dummy",
        header: ({ column }) => renderColumnHeader(column, "Dummy"),
    },
    {
        accessorKey: "dummy_two",
        header: ({ column }) => renderColumnHeader(column, "Dummy two"),
    },
    {
        accessorKey: "dummy_three",
        header: ({ column }) => renderColumnHeader(column, "Dummy three"),
    },
];

const BotDataTable = () => {
    return (
        <>
            <DataTable columns={columns} data={botsManagementRows} />
        </>
    )
}

export default BotDataTable;

const StatusBadge = ({ status }: { status: string }) => {
    let statusColor = '';
    let dotColor = '';
    switch (status) {
        case 'active':
            statusColor = 'bg-green-200'
            dotColor = "green"
            break;

        case 'archived':
            statusColor = 'bg-gray-200'
            dotColor = "gray"
            break;

        case 'draft':
        default:
            statusColor = 'bg-orange-200'
            dotColor = "orange"
            break;
    }
    return (
        <Badge variant="outline" className={`border-0 capitalize gap-2 ${statusColor}`} >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={dotColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dot">
                <circle cx="12.1" cy="12.1" r="4" fill={dotColor}></circle>
            </svg>{status}
        </Badge>
    )
}