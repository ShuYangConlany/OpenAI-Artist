"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("f1ac0941-7845-4d81-b3c4-d65b6d71b8f0");
  }, []);

  return null;
};
