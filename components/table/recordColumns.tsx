"use client"


import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { StudentProgram } from "@/constants"
import RecordModal from "../RecordModal"
import { Record } from "@/types/appwrite.types";


export const recordColumns: ColumnDef<Record>[] = [

    {
        header: '#',
        cell: ({ row }) => {
            return <p className="text-14-medium ">{row.index + 1}</p>;
        },
    },
    {
        accessorKey: "student",
        header: "Student",
        cell: ({ row }) => {
            const record = row.original;

            const studentProgram = JSON.parse(record.studentProgram);
            const studentName = studentProgram.studentName;
            return <p className="text-14-medium">{studentName}</p>
        }
    },
    {
        accessorKey: "recordNote",
        header: "記錄",
        cell: ({ row }) => {
            const record = row.original;
            return <p className="text-14-medium">{record.recordNote}</p>
        }
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const record = row.original;
            return (
                <div className="min-w-[115px]">
                    <StatusBadge status={record.status} />
                </div>
            );
        },
    },
    {
        accessorKey: "schedule",
        header: "Date",
        cell: ({ row }) => {
            const record = row.original;
            return (
                <p className="text-14-regular min-w-[100px]">
                    {formatDateTime(record.schedule).dateTime}
                </p>
            );
        },
    },
    {
        accessorKey: "studentProgram",
        header: "Program",
        cell: ({ row }) => {
            const record = row.original;
            const selectedProgram = JSON.parse(record.studentProgram);

            return (
                <div className="flex items-center gap-3">
                    <p className="whitespace-nowrap">{selectedProgram?.programTopic}</p>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="pl-4">Actions</div>,
        cell: ({ row }) => {
            const record = row.original;

            return (
                <div className="flex gap-1">
                    {/* <RecordModal
                        teacherId={record.teacher.$id}
                        userId={record.userId}
                        record={record}
                        type="Processing"
                        title="Schedule record"
                        description="新增諮詢記錄"
                        renew={false} /> */}

                    <RecordModal
                        teacherId={record.teacher.$id}
                        userId={record.userId}
                        record={record}
                        renew={true}
                        title="編輯記錄"
                        description="編輯諮詢記錄"
                        type="Processing" />
                </div>
            );
        },
    }
]
