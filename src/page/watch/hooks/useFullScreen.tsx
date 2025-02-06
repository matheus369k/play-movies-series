import { useEffect, useState } from "react";

export function useFullScreen() {
  const [watchAction, setWatchAction] = useState({
    isLoading: false,
    isFullScreen: false,
  });

  console.log(watchAction)

  function handleSetWatchAction({
    isFullScreen,
    isLoading,
  }: {
    isLoading: boolean;
    isFullScreen: boolean;
  }) {
    setWatchAction({
      isLoading,
      isFullScreen,
    });
  }

  async function handleEnterFullScreen() {
    await document
      .getElementById("videoScreen")
      ?.requestFullscreen()
      .catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
  }

  async function handleExitFullScreen() {
    await document.exitFullscreen().catch((err) => {
      console.error("Error attempting to exit full-screen mode:", err);
    });
  }

  useEffect(() => {
    document
      .getElementById("videoScreen")
      ?.addEventListener("fullscreenchange", () => {
        const isFullScreen = watchAction.isFullScreen;

        if (isFullScreen) {
          document.documentElement.classList.add("remove-scroll");
          setWatchAction((state) => {
            return {
              ...state,
              isFullScreen: false,
            };
          });

          return;
        }

        document.documentElement.classList.remove("remove-scroll");

        setWatchAction((state) => {
          return {
            ...state,
            isFullScreen: true,
          };
        });
      });

    return () => {
      document.removeEventListener("fullscreenchange", () => {
      });
    };
  }, []);

  return {
    watchAction,
    handleExitFullScreen,
    handleEnterFullScreen,
    handleSetWatchAction,
  };
}
