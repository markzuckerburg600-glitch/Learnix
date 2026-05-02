"use server"
// Fetch all notebooks from database
import Link from "next/link"
export default async function page() {
  const notebooks = await fetch("/api/notebooks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  const notebooksData = await notebooks.json()

  return (
    <>
    <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      hello
      <button>
        Create Notebook
      </button>
      {notebooksData.map((notebook) => (
        <div key={notebook.id}>
          <Link href={`/dashboard/${notebook.id}`}>
            {notebook.name}
          </Link>
        </div>
      ))}
    </div>
    </>
  )
}
