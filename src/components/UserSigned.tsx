"use client";

import useUserStore from "@/store/User";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const UserSigned = () => {
  const { setSigned, setLoadingData, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    async function verifyToken() {
      const token = Cookies.get("authTokenDevPlannr");
      if (token) {
        try {
          const response = await fetch("http://localhost:3000/validar-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            setLoadingData(false);
            setSigned(false);
            setUser(null);
            router.push("/login");
          }
          setLoadingData(false);
          setSigned(true);
          setUser(data.user);
        } catch (err) {
          console.log(err);
        }
      }
    }
    verifyToken();
  }, [router, setLoadingData, setSigned, setUser]);
  return <></>;
};

export default UserSigned;
