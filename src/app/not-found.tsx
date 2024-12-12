"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic"
const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [router]);
  return null;
};

export default NotFound;
