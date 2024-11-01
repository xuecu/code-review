import React from 'react'
import Image from "next/image"
import Link from "next/link";
import RecordForm from '@/components/forms/RecordForm';
import { getRouteMatcher } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getTeacher } from '@/lib/actions/teacher.actions';
import { getRecentRecordList } from '@/lib/actions/record.actions';
import { RecordDataTable } from '@/components/table/RecordDataTable';
import { recordColumns } from '@/components/table/recordColumns';
import { Button } from '@/components/ui/button';


export default async function NewRecord({ params: { userId } }: SearchParamProps) {
    const teacher = await getTeacher(userId)
    const records = await getRecentRecordList()
    const recordsOfTeacher = records.documents.filter((record: { userId: string; }) => record.userId === userId);
    console.log('這是：recordsOfTeacher', recordsOfTeacher)
    // console.log(teacher)

    const RecordTableByProgram = ({ recordsOfTeacher, recordColumns }) => {
        // 將 recordsOfTeacher 根據 studentName 分組
        const recordsByStudentName = recordsOfTeacher.reduce((acc, record) => {
            const studentProgram = JSON.parse(record.studentProgram); // 解析 studentProgram 為 JSON 對象
            const studentName = studentProgram.studentName;

            if (!acc[studentName]) {
                acc[studentName] = [];
            }

            acc[studentName].push(record);
            return acc;
        }, {});

        return (
            <div>
                {Object.keys(recordsByStudentName).map(studentName => (
                    <div key={studentName}>
                        <h2>學生姓名: {studentName}</h2>
                        <RecordDataTable columns={recordColumns} data={recordsByStudentName[studentName]} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[1360px] flex-1 justify-between">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="teachcake"
                        className="mb-12 h-10 w-fit"
                    />

                    <RecordForm
                        type="Processing"
                        userId={userId}
                        teacherId={teacher.$id}
                        renew={false}
                        record={recordsOfTeacher[0]}
                        setOpen={console.log(teacher)}
                    />

                    <section className="my-12 space-y-4">
                        <h1 className="header">過去記錄</h1>
                        <p className="text-dark-700">嗨！{teacher.name}，這邊是你所有的諮詢記錄。</p>
                    </section>

                    {/* 這是原始的RecordDataTable，沒有經過student program篩選
                    <RecordDataTable columns={recordColumns} data={recordsOfTeacher} /> */}

                    {/* 這是有student program篩選後的結果 */}
                    <RecordTableByProgram recordsOfTeacher={recordsOfTeacher} recordColumns={recordColumns} />
                    <p className="copyright mt-10 py-12">
                        © 2024 Teachcake
                    </p>

                </div>
            </section >

        </div >
    )
}

