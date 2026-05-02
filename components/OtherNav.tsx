"use client"
import Link from "next/link"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Logo from "@/public/Logo.png"

// Navbar after user sign in 
export default function OtherNavbar() {

  return (
    <>
      <header className="w-full fixed z-50 bg-white p-3 transition-opacity duration-1000 ease-in-out"
        style={{ opacity: 1 }}
      >
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src={Logo} alt="Logo" height={80} width={80} />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignUpButton
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
              >
                <button className="font-semibold hover:text-gray-700">Sign Up</button>
              </SignUpButton>
              <SignInButton
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
              >
                <button className="font-semibold hover:text-gray-700">Login</button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </nav>
      </header>
      <Show when="signed-out">
        <SignUpButton
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        >
          <button className="font-semibold hover:text-gray-700">Sign Up</button>
        </SignUpButton>
        <SignInButton
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        >
          <button className="font-semibold hover:text-gray-700">Login</button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  )
}
