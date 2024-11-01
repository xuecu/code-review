"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Record } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";
import RecordForm from "./forms/RecordForm";


const RecordModal = ({
    renew,
    teacherId,
    userId,
    record,
    type,
}: {
    renew: boolean;
    teacherId: string;
    userId: string;
    record?: Record;
    type: "Processing" | "Completed" | "Missing" | "Failed";
    title: string;
    description: string;
}) => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className={`capitalize ${renew && "text-green-500"}`}>
                    {renew ? "編輯紀錄" : "加新記錄"}
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog sm:max-w-md">
                <DialogHeader className="mb-4 space-y-3">
                    <DialogTitle className="capitalize">{renew ? "編輯諮詢記錄" : ""}</DialogTitle>
                    <DialogDescription>
                        {renew ? "" : ""}
                    </DialogDescription>
                </DialogHeader>

                <RecordForm
                    renew={renew}
                    userId={userId}
                    teacherId={teacherId}
                    type={type}
                    record={record}
                    setOpen={setOpen}
                />

            </DialogContent>
        </Dialog>
    )
}

export default RecordModal
