'use client'
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button";


const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/destinations", label: "Destinations" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/add-destination", label: "Add Destination" },
];

export default function Navbar() {

  const { data: session } = authClient.useSession()
  const user = session?.user

  const handleSignOut = () => {
    authClient.signOut()
  }



  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="relative flex h-14 items-center justify-between px-6">
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${link.active
                ? "text-teal-600"
                : "text-gray-700 hover:text-teal-600"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2"
          aria-label="Wanderlast home"
        >
          <Image
            src="/images/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            className="h-6 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-5 text-sm text-gray-700">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 transition-colors hover:text-teal-600"
          >
            <UserIcon className="size-4" />
            Profile
          </Link>
          {

            user ?
              <Popover>
                <PopoverTrigger render={<Button variant="outline" />}>
                  <Avatar>
                    <AvatarImage referrerPolicy="no-referrer" src={user?.image as string} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>{user?.name}</PopoverTitle>
                    <PopoverDescription>
                      <p>{user?.email}</p>
                      <Button onClick={handleSignOut} variant={'destructive'}>Sign Out</Button>
                    </PopoverDescription>

                  </PopoverHeader>
                </PopoverContent>
              </Popover>
              :
              <>
                <Link href="/signin" className="transition-colors hover:text-teal-600">
                  Sign In
                </Link>
                <Link href="/signup" className="transition-colors hover:text-teal-600">
                  Sign Up
                </Link>
              </>
          }
        </div>
      </div>
    </header>
  );
}
