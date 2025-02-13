import { TopResetScroll } from "@/functions";
import { useEffect, useState } from "react";
import { BsArrowUpCircle } from "react-icons/bs";

export function BackTopPage() {
  const [isHiddenButton, setIsHiddenButton] = useState(true);

  function handleHiddenButton() {
    const scrollYPosition = window.scrollY;
    const heightScreen = window.innerHeight;

    if (heightScreen < scrollYPosition) {
      setIsHiddenButton(false);
      return;
    }

    setIsHiddenButton(true);
  }
  useEffect(() => {
    window.addEventListener("scroll", handleHiddenButton);
  }, []);

  return (
    <div
      className={`fixed top-32 right-4 z-50 hover:shadow rounded-full group/btn transition-opacity ${
        isHiddenButton ? "opacity-0" : "opacity-100"
      }`}
    >
      <button
        onClick={TopResetScroll}
        type="button"
        title="back top"
        className="bg-zinc-900 border border-zinc-700 group-hover/btn:border-zinc-100 transition-colors group-hover/btn:animate-pulse w-10 h-10 flex justify-center items-center rounded-full"
      >
        <BsArrowUpCircle className="size-8 text-zinc-700 group-hover/btn:text-zinc-100 transition-colors" />
      </button>
    </div>
  );
}
