import QuizGeneratorServer from "@/components/Quiz/QuizGeneratorServer"

export default async function page({ params }: { params: { notebookid: string } }) {
    const notebookId = await params.notebookid 

  return (
    <div>
      <QuizGeneratorServer notebookId={notebookId}/>
    </div>
  )
}
