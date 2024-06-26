import { ComponentProps } from "react";

interface PropsCell extends ComponentProps<"li"> {
    title: string
    value: string | undefined
}

export function Cell({title, value,...props}: PropsCell) {
    return <li {...props} className="max-sm:text-sm"><span className="text-gray-100">{title}: </span>{value || ""}</li>
}