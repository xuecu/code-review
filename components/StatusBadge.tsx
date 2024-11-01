import { StatusIcon } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import React from 'react'

const StatusBadge = ({ status }: { status: Status }) => {
    return (
        <div
            className={clsx("status-badge", {
                "bg-green-600": status === "Processing",
                "bg-blue-600": status === "Completed",
                "bg-red-600": status === "Missing",
                "bg-yellow-800": status === "Failed",
            })}
        >
            <Image
                src={StatusIcon[status]}
                alt="doctor"
                width={24}
                height={24}
                className="h-fit w-3"
            />
            <p
                className={clsx("text-12-semibold capitalize", {
                    "text-green-500": status === "Processing",
                    "text-blue-500": status === "Completed",
                    "text-red-500": status === "Missing",
                    "text-red-700": status === "Failed",
                })}
            >
                {status}
            </p>
        </div>
    )
}

export default StatusBadge
