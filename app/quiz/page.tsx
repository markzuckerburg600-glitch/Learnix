import QuizGeneratorServer from "@/components/QuizGeneratorServer"

export default function Page() {
  return (
    <main className = "flex flex-col justify-center items-center mt-30">  
    <h1 className="text-bold text-5xl">
      Quiz Creator 
    </h1>
      <p className = "text-1xl text-gray-700 p-4"> Exam stressing you out? Generate quizzes and practice now! </p>
      <QuizGeneratorServer/>
    </main>
  )
}
