// Fetch all notebooks from database
import Link from "next/link"
import connect from "@/lib/database/db"
import Notebook from "@/lib/database/models/Notebook"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Plus, BookOpen, Calendar, FileText, Video } from "lucide-react"

async function createNotebook(userId: string) {
  await connect()
  const notebook = await Notebook.create({
    userId,
    name: "Untitled Notebook",
    sources: [],
    linkSources: [],
    linkSourcesTitles: []
  })
  return notebook._id.toString()
}

export default async function page() {
  const { userId } = await auth()
  const user = await currentUser()
  
  if (!userId) {
    return <div>Please sign in</div>
  }
  
  await connect()
  
  const notebooks = await Notebook.find({ userId }).sort({ updatedAt: -1 })

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create and manage your notebooks
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create Notebook Card */}
          <form action={async () => {
            "use server"
            const { userId } = await auth()
            if (userId) {
              const notebookId = await createNotebook(userId)
              redirect(`/dashboard/${notebookId}`)
            }
          }}>
            <button 
              type="submit"
              className="group relative h-64 w-full rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Create Notebook</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start a new project</p>
              </div>
            </button>
          </form>

          {/* Notebook Cards */}
          {notebooks.map((notebook) => (
            <Link 
              key={notebook._id.toString()} 
              href={`/dashboard/${notebook._id.toString()}`}
              className="group relative h-64 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
            >
              <div className="h-full p-6 flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
                  {notebook.name}
                </h3>
                
                {/* Stats */}
                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>{notebook.sources?.length || 0} PDFs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Video className="w-4 h-4" />
                    <span>{notebook.linkSources?.length || 0} Videos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(notebook.updatedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {notebooks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No notebooks yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first notebook to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
