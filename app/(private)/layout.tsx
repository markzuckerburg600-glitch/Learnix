import OtherNavbar from "@/components/OtherNav"

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OtherNavbar/>
      {children}
    </>
  )
}
