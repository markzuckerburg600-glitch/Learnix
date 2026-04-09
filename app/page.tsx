import HomeStyle from "@/components/HomeLayout/HomeStyle"
import Navbar from "@/components/HomeLayout/Navbar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
// Homepage
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
