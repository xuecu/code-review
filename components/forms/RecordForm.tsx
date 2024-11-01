"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { Key, useEffect, useState } from "react"
import { getRecordSchema, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/teacher.actions"
import { FormFieldType } from "./TeacherForm"
import { ProgramStatus, StudentProgram } from "@/constants"
import { SelectItem } from "../ui/select"
import { createRecord, updateRecord } from "@/lib/actions/record.actions";
import { Program, Record, Teacher } from "@/types/appwrite.types";
import { recordColumns } from '@/components/table/recordColumns';
import { RecordDataTable } from '@/components/table/RecordDataTable';
import { getProgramList } from "@/lib/actions/program.actions";


const RecordForm = ({ userId, type, teacherId, record, setOpen, renew }: {
    userId: string;
    teacherId: string;
    type: "Processing" | "Completed" | "Missing" | "Failed";
    record?: Record;
    setOpen: (open: boolean) => void;
    renew: boolean;
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [studentPrograms, setStudentPrograms] = useState();
    const RecordFormValidation = getRecordSchema(type);


    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const programs = await getProgramList();
                if (programs) {
                    setStudentPrograms(programs as Program[]);
                }
                console.log('programs:', programs.documents)
            } catch (error) {
                console.error("Failed to fetch programs:", error);
            }
        };

        fetchPrograms();
    }, []);


    // 表單設定區
    const form = useForm<z.infer<typeof RecordFormValidation>>({
        resolver: zodResolver(RecordFormValidation),
        defaultValues: {
            studentProgram: renew ? record?.studentProgram : "",
            schedule: record ? new Date(record?.schedule) : new Date(Date.now()),
            recordNote: renew ? record?.recordNote : "",
            status: renew ? record?.status : "Processing",
        },

    })

    // 表單送出後要做的事
    async function onSubmit(values: z.infer<typeof RecordFormValidation>) {

        // 處理表單的值
        setIsLoading(true);
        console.log('Submitted Values:', values);
        // 印出record
        console.log('Record:', record);

        let status
        switch (type) {
            case "Processing":
                status = "Processing"
                break;
            case "Completed":
                status = "Completed"
                break;
            case "Missing":
                status = "Missing"
                break;
            default:
                status = "Failed"
                break;
        }
        try {
            if (!renew && teacherId) {
                console.log('開始新增record')
                console.log('Record:', record);
                const recordData = {
                    userId,
                    teacher: teacherId,
                    studentProgram: values.studentProgram,
                    schedule: new Date(values.schedule),
                    recordNote: values.recordNote!,
                    status: values.status as Status,
                    otherNote: values.otherNote,
                }

                const newRecord = await createRecord(recordData);
                if (newRecord) {
                    form.reset();
                    router.push(
                        `/teachers/${userId}/new-record/success?recordId=${newRecord.$id}`
                    );
                }
            }
            else {
                // const selectedProgram = JSON.parse(values.studentProgram);
                // const program = StudentProgram.find((program) => program.studentProgramId === selectedProgram.studentProgramId);
                console.log('開始編輯record')
                console.log('Record:', record);
                const recordToUpdate = {
                    userId,
                    recordId: record?.$id!,
                    record: {
                        studentProgram: values.studentProgram,
                        schedule: new Date(values.schedule),
                        status: values.status as Status,
                        recordNote: values.recordNote!,
                    },
                    type,
                };
                console.log('RecordToUpdate:', recordToUpdate);
                //updateRecord待處理
                const updatedRecord = await updateRecord(recordToUpdate);

                if (updatedRecord) {
                    setOpen && setOpen(false);
                    form.reset();
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    let buttonLabel;
    switch (type) {
        case "Completed":
            buttonLabel = "送出";
            break;
        case "Missing":
            buttonLabel = "送出";
            break;
        case "Failed":
            buttonLabel = "送出";
            break;
        default:
            buttonLabel = "送出";
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">

                {!renew && (
                    <section className="mb-12 space-y-4">
                        <h1 className="header">諮詢記錄</h1>
                        <p className="text-dark-700">總監辛苦了！像醫生問完診的問診記錄，總監教完學生有諮詢記錄，這邊的記錄我們會逐筆審核。</p>
                    </section>
                )}
                {type !== "Failed" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="studentProgram"
                            label="學生專案"
                            placeholder="請選擇"
                            disabled={renew}>
                            {studentPrograms?.documents.map((program: { $id: any; programNote: any; studentId: any; ProgramID: any; }, i: Key | null | undefined) => (
                                <SelectItem
                                    key={i}
                                    value={JSON.stringify({
                                        program: program.$id,
                                        programTopic: program.programNote,
                                        studentName: program.studentId,
                                        studentProgramId: program.ProgramID
                                    })}>

                                    <div className="flex cursor-pointer items-center gap-2">
                                        <p>{`${program.$id} : ${program.programNote} - ${program.studentId}`}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="recordNote"
                            label="諮詢記錄"
                            placeholder="這邊主要記錄學生狀態"
                        // disabled={type === "Processing"}
                        />

                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="登記時間"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy  -  h:mm aa"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="status"
                            label="專案狀態"
                            placeholder="四選一">
                            {ProgramStatus.map((status, i) => (
                                <SelectItem key={i} value={status}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <p>{status}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>
                    </>
                )}

                {type === "Failed" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Urgent meeting came up"
                    />
                )}

                <SubmitButton isLoading={isLoading} className={`${type === "Failed" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form >
    )
}

export default RecordForm
