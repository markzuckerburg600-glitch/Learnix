import HomeStyle from "@/components/HomeStyle"
import Navbar from "@/components/Navbar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Page() {
  const { userId } = await auth()
  if (userId){
    redirect("/dashboard")
  }
  return (
    <>
      <Navbar/>
      <HomeStyle/>
    </>
  )
}
