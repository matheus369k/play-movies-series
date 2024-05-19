import { ComponentProps } from "react";

interface PropsButtonSwitch extends ComponentProps<"button"> {}

export function ButtonSwitch(props: PropsButtonSwitch) {
    return (
        <button {...props} className={`transition-all p-2 rounded-full ${props.disabled ? "opacity-20" : "hover:bg-white/10 hover:scale-105"}`} type="button"/>
    )
}