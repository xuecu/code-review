"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getRecordSchema, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/teacher.actions"
import { FormFieldType } from "./TeacherForm"
import { StudentProgram } from "@/constants"
import { SelectItem } from "../ui/select"


const RecordForm = ({ userId, type, teacherId }: {
    userId: string;
    teacherId: string;
    type: "create" | "cancel" | "schedule";

}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)


    const RecordFormValidation = getRecordSchema(type);

    // 表單設定區
    const form = useForm<z.infer<typeof RecordFormValidation>>({
        resolver: zodResolver(RecordFormValidation),
        defaultValues: {
        },

    })

    // 表單送出後要做的事
    async function onSubmit(values: z.infer<typeof RecordFormValidation>) {
        // 處理表單的值
        setIsLoading(true);
        try {
            // 晚點來做
            const userData = { name, email, phone };

            const user = await createUser(userData);

            if (user) router.push(`/teachers/${user.$id}/register`)
        } catch (error) {
            console.log(error)
        }
    }

    let buttonLabel;
    switch (type) {
        case "cancel":
            buttonLabel = "cancel";
            break;
        case "create":
            buttonLabel = "create";
            break;
        default:
            buttonLabel = "預設提交";
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">諮詢記錄</h1>
                    <p className="text-dark-700">總監辛苦了！像醫生問完診的問診記錄，總監教完學生有諮詢記錄，這邊的記錄我們會逐筆審核。</p>
                </section>
                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="studentProgram"
                            label="學生專案"
                            placeholder="請選擇">
                            {StudentProgram.map((program, i) => (
                                <SelectItem key={program.studentName + i} value={program.studentName}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={program.image}
                                            width={32}
                                            height={32}
                                            alt="program"
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{`${program.program} : ${program.programTopic} - ${program.studentName}`}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="諮詢完成時間"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy  -  h:mm aa"
                        />
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="recordNote"
                                label="諮詢記錄"
                                placeholder="這邊主要記錄學生狀態"
                                disabled={type === "schedule"}
                            />
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="otherNote"
                                label="其他備註"
                                placeholder="這邊是給其他對象的記錄 ex.助教、公司...等"
                                disabled={type === "schedule"}
                            />
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Urgent meeting came up"
                    />
                )}

                <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>{buttonLabel}</SubmitButton>
            </form>
        </Form >
    )
}

export default RecordForm
