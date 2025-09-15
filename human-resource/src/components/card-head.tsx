'use client'

import { cardClass } from "@/types/cardClass"

export default function CardHead({Icon, title, jumlah, perubahan,itemClass, logoClass}: cardClass) {
    const gaji = Intl.NumberFormat('en-US').format(jumlah)
    return (
        <div className={`w-1/4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl flex bg-white items-end p-3 justify-between ${itemClass}`}>
            <div className="flex space-x-3 items-center">
                <Icon className={`rounded-lg p-1 ${logoClass}`} />{" "}
                <span className="text-gray-600 text-sm font-medium">{title}</span>
            </div>
            <div className="flex flex-col items-end justify-end">
                <div className="text-gray-500 text-xs">{perubahan}</div>
                <div className="text-[#282828] text-2xl pt-1 font-semibold">{perubahan.includes('Gaji')? gaji : jumlah}</div>
            </div>
        </div>
    )
}