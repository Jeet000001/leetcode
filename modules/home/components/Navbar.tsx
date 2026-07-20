"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { CodeXml, Menu, X } from "lucide-react";

import { UserRole } from "@/lib/generated/prisma/enums";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  userRole?: UserRole;
}

const Navbar = ({ userRole }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4">
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-black/20">
        <div className="flex h-16 items-center justify-between px-5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-wide text-amber-300"
          >
            <CodeXml className="h-7 w-7" />
            <span>LeetCode</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/problems" className="transition hover:text-amber-400">
              Problems
            </Link>

            <Link href="/about" className="transition hover:text-amber-400">
              About
            </Link>

            <Link href="/profile" className="transition hover:text-amber-400">
              Profile
            </Link>
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-4 md:flex">
            <Show when="signed-in">
              {userRole === UserRole.ADMIN && (
                <Link href="/create-problem">
                  <Button variant="outline">Create Problem</Button>
                </Link>
              )}

              {/* User Info */}
              <div className="flex items-center gap-3">
                <UserButton />
              </div>
            </Show>

            <Show when="signed-out">
              <SignInButton>
                <Button variant="ghost">Sign In</Button>
              </SignInButton>

              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </Show>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* ================= Mobile Menu ================= */}
        {open && (
          <div className="border-t border-white/10 px-5 py-5 md:hidden">
            <Show when="signed-in">
              {/* User Section */}
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                {/* Left Side User Icon */}
                <UserButton />

                {/* Right Side Name */}
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {user?.fullName ||
                      user?.firstName ||
                      user?.username ||
                      "User"}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
            </Show>

            {/* Navigation */}
            <div className="flex flex-col gap-1">
              <Link
                href="/problems"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 transition hover:bg-white/10"
              >
                Problems
              </Link>

              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 transition hover:bg-white/10"
              >
                About
              </Link>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 transition hover:bg-white/10"
              >
                Profile
              </Link>

              <Show when="signed-in">
                {userRole === UserRole.ADMIN && (
                  <Link href="/create-problem" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="mt-3 w-full">
                      Create Problem
                    </Button>
                  </Link>
                )}
              </Show>

              <Show when="signed-out">
                <div className="mt-4 flex flex-col gap-3">
                  <SignInButton>
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton>
                    <Button className="w-full">Sign Up</Button>
                  </SignUpButton>
                </div>
              </Show>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
