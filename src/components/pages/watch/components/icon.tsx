import { ComponentProps } from "react";

interface PropsICon extends ComponentProps<"i"> {}

export function Icon(props: PropsICon) {
    return <i {...props} className="cursor-pointer text-2xl max-sm:text-lg"></i>
}