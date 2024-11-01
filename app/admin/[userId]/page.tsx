import Link from 'next/link'
import React from 'react'
import Image from "next/image";
import StatCard from '@/components/StatCard';
import { getRecentRecordList } from '@/lib/actions/record.actions';
import { DataTable } from '@/components/table/DataTable';
import { columns } from '@/components/table/columns';




const Admin = async ({ params }: { params: { userId: string } }) => {
    const userId = params.userId;  // 獲取傳入的 userId
    const records = await getRecentRecordList()

    return (
        <div className="mx-auto flex max-w-7xl flex-col space-y-14">
            <header className="admin-header">
                <Link href="/" className="cursor-pointer" passHref>
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={32}
                        width={162}
                        alt="logo"
                        className="h-8 w-fit"
                    />
                </Link>

                <Link href={`/admin/${userId}/new-program`} passHref>
                    <button className="bg-gray-900 text-gray-400 px-4 py-2 rounded">
                        設定專案
                    </button>
                </Link>


            </header>
            <main className="admin-main">
                <section className="w-full space-y-4">
                    <h1 className="header">嗨！學促夥伴 👋</h1>
                    <p className="text-dark-700">
                        美好的一天從管理總監開始
                    </p>
                </section>

                <section className="admin-stat">
                    <StatCard
                        type="Processing"
                        count={records.ProcessingCount}
                        label="進行中"
                        icon={"/assets/icons/appointments.svg"}
                    />
                    <StatCard
                        type="Completed"
                        count={records.CompletedCount}
                        label="已完成"
                        icon={"/assets/icons/pending.svg"}
                    />
                    <StatCard
                        type="Missing"
                        count={records.MissingCount}
                        label="迷失的羔羊"
                        icon={"/assets/icons/cancelled.svg"}
                    />
                    <StatCard
                        type="Failed"
                        count={records.FailedCount}
                        label="退費"
                        icon={"/assets/icons/cancel.png"}
                    />

                </section>
                <DataTable columns={columns} data={records.documents} />
            </main>


        </div>
    )
}

export default Admin
