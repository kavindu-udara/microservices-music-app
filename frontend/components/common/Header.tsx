"use client";
import { RootState } from "@/store";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="flex flex-row justify-between px-10 py-3">
      <div>home</div>
      <div></div>
      <div>
        {!user ? (
          <Link href={"/login"}>
            <Button>sign in</Button>
          </Link>
        ) : (
          <div>profile</div>
        )}
      </div>
    </header>
  );
};

export default Header;
