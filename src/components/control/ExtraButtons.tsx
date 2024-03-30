"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { useTheme } from "next-themes";
import { Sun, Moon, GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExtraButtons = () => {
  // The `useTheme` hook from the `next-themes` library is used to get the current theme
  // and a function to set the theme.
  const { theme, setTheme } = useTheme();

  // The `useState` hook is used to manage the `isLoaded` state, which is initially set to `false`.
  const [isLoaded, setIsLoaded] = useState(false);

  // The `useEffect` hook is used to set the `isLoaded` state to `true` when the component mounts.
  // This is done to ensure that the component is only rendered after the necessary data has been loaded.
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // If the `isLoaded` state is `false`, the component will not render anything.
  // This is a common pattern to handle cases where the component needs to wait for some data to be loaded
  // before it can be rendered.
  if (!isLoaded) {
    return null;
  }

  // The component returns a `div` element that contains two buttons:
  // 1. A button that toggles the theme between light and dark mode.
  // 2. A button that links to the project's GitHub repository.
  return (
    <div
      className={`absolute bottom-0 p-2 gap-6 flex w-full bg-white dark:bg-[#0c0a09]`}
    >
      <Button
        className={`w-full`}
        type={`button`}
        variant={`secondary`}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
      <Link
        href={`https://github.com/e-roy/gemini-pro-vision-playground`}
        className={`w-full`}
        passHref
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className={`w-full`} type={`button`} variant={`secondary`}>
          <GithubIcon className={`h-5 w-5`} />
        </Button>
      </Link>
    </div>
  );
};