"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Logo from "@/public/Logo.png"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import ScrollTrigger from "gsap/src/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
export default function Navbar() {
  // Get that underline 
  const pathName = usePathname()
  const links = [
    { label: "Dashboard", href: "/dashboard"},
    { label: "Study", href: "/study"},
    { label: "Quizzes", href: "/quiz"},
    { label: "Video", href: "/video"},
    { label: "Chatbot",  href: "/help"},
  ]

  useGSAP(() => {
    gsap.fromTo("#nav-background", {
      backdropFilter: "blur(0px)",
    }, {
      backdropFilter: "blur(30px)",
      duration: 1,
      opacity: 0.90,
      ease: "elastic.inOut",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    })
  }, [])

  return (
    <>
    <header id = "nav" className="w-full fixed z-50 p-3 transition-opacity duration-1000 ease-in-out" 
    style={{ opacity: 1 }}
    >
      <div id="nav-background" className="absolute inset-0 -z-10 bg-white" />
      <nav className = "flex justify-between items-center relative">
        <div className = "flex items-center gap-4">
          <Link href="/" className = "flex items-center gap-2">
            <Image src = {Logo} alt = "Logo" height = {80} width = {80}/>
          </Link>
        </div>
        
        <ul className = "flex flex-row justify-center items-center list-none gap-7">
        {links.map((value, index) => {
          // Put underline if pathName matches the specific navbar li
          const isActive = pathName === value.href 
          return (
              <li key = {index}>
                <Link href = {value.href} className = {`${isActive ? "underline" : ""} font-semibold hover:text-gray-700`}>
                {value.label}
                </Link>
              </li>
          )
        })}
        </ul>

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
    </>
  )
}
