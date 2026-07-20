import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { UserRole } from "@/lib/generated/prisma/enums";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  userRole?: UserRole;
}

const Navbar = ({ userRole }: NavbarProps) => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg dark:border-white/10 dark:bg-black/10">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-widest text-amber-300">
            LeetCode
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/problems">Problems</Link>
            <Link href="/about">About</Link>
            <Link href="/profile">Profile</Link>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-in">
              {userRole === UserRole.ADMIN && (
                <Link href="/create-problem">
                  <Button variant="outline">
                    Create Problem
                  </Button>
                </Link>
              )}

              <UserButton />
            </Show>

            <Show when="signed-out">
              <SignInButton>
                <Button variant="ghost">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button>
                  Sign Up
                </Button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;