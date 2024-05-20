import { MdError } from "react-icons/md";
import { twMerge } from "tailwind-merge";

interface PropsLoading {
    message: string
    styles?: string
}

export function Error({ message, styles }: PropsLoading) {
    return (
        <div className={twMerge("flex items-center gap-2 text-gray-100 w-max mx-auto", styles)}>
            <MdError className="size-8 animate-pulse" />
            <span className="font-bold text-2xl">{message}</span>
        </div>
    )
}