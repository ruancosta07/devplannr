"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider as Themes } from "next-themes";
const ThemeProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if(!mounted) return <>{children}</>
  return (
    <Themes attribute={"class"} defaultTheme="system">
      {children}
    </Themes>
  );
};

export default ThemeProvider;
