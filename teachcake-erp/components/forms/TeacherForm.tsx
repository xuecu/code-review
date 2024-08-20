"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/teacher.actions"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'date_picker',
    SELECT = 'select',
    SKELETON = 'skeleton',
    MULTISELECT = 'multiselect'
}

const TeacherForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // 表單設定區
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    })

    // 表單送出後要做的事
    async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi 總監 👋</h1>
                    <p className="text-dark-700">帶學生辛苦了！請在這邊紀錄學生狀況，我們會以此為匯款標準</p>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="總監姓名"
                    placeholder="陳總監"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="teacher@teachcake.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />

                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone number"
                    placeholder="(555) 123-4567"
                />

                <SubmitButton isLoading={isLoading}>開始</SubmitButton>
            </form>
        </Form>
    )
}

export default TeacherForm
