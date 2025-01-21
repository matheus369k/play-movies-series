import { ComponentProps } from "react";

interface PropsButtonSwitchPage extends ComponentProps<"button"> {}

export function ButtonSwitchPage(props: PropsButtonSwitchPage) {
    return (
        <button
            {...props}
            className={`size-10 rounded flex items-center justify-center text-gray-100 border border-gray-200/5 ${
                props.disabled 
                ? "bg-black/25" 
                : "bg-black cursor-pointer"}`
            }
            type="button"
        />
    )
}