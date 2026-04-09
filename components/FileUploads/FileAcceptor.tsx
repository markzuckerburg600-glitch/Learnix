"use client"
import { Fragment, useState } from "react"
import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import type { QuestionMap } from "@/components/Quiz/QuizGeneratorServer"
export default function FileAcceptor(
  // Creates pdf and pdf viewer for downloading the quiz 
  { quizData, 
    includeKey, 
    includeSimpleKey, 
    title, 
    header }: 
    { 
    quizData: QuestionMap[] | null, 
    includeKey: boolean, 
    includeSimpleKey: boolean, 
    title: string, 
    header:string }) 
  {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 30
    },
    questionContainer: {
      marginBottom: 20,
      paddingBottom: 15,
    },
    questionText: {
      fontSize: 14,
      marginBottom: 12,
      lineHeight: 1.5
    },
    choicesContainer: {
      marginLeft: 10
    },
    choice: {
      fontSize: 12,
      marginBottom: 6,
      lineHeight: 1.4
    },
    correctChoice: {
      fontSize: 12,
      marginBottom: 6,
      lineHeight: 1.4,
      fontWeight: "bold",
    },
    simpleCorrectChoice: {
      fontSize: 12,
      marginBottom: 6,
    },
    reasoning: {
      fontSize: 12,
      marginBottom: 6,
      marginTop: 2,
      lineHeight: 1.4
    },
    title: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    header: {
      width: "100%",
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      paddingBottom: 10,
      borderBottom: "2 solid #E0E0E0",
    },
})

  const choiceMappings = {
    1: " A",
    2: " B",
    3: " C",
    4: " D",
  }
  return (
    <>
      {/* Normal Mode */}
      {(!isFullscreen && quizData) && (
        <div className={cn(
          "w-full h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
          "border border-border rounded-lg shadow-lg overflow-hidden",
          "transition-all duration-300 ease-in-out"
        )}>
          <div className="bg-white dark:bg-slate-800 border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">PDF Preview</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live Preview
                </div>
                <Button 
                  onClick={() => setIsFullscreen(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Fullscreen
                </Button>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[calc(100vh-73px)] bg-white dark:bg-slate-900">
            <PDFViewer 
              className="w-full h-full border-0"
              style={{ 
                width: '100%', 
                height: '100%',
                backgroundColor: 'rgb(249 250 251)'
              }}
            >
              <Document title={title || "Quiz Document"}>
                <Page size="A4" style={styles.page}>
                  {header && (
                    <Text style={styles.header}>{header}</Text>
                  )}
                  {quizData.map((question: QuestionMap, index: number) => {
                    return (
                      <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionText}>
                          {index+1}. {question.questionText}
                        </Text>
                        <View style={styles.choicesContainer}>
                          {question.choices.map((choice, i: number) => 
                            <Fragment key={i}>
                              <Text style={styles.choice}>
                                {String.fromCharCode(65 + i)}. {choice}
                              </Text>
                            </Fragment>
                          )}
                        </View>
                      </View>
                    )
                  })}
                  {/* Answer key */}
                  {includeKey && 
                  <>
                  <Text style={styles.title}> Answer Key </Text>
                  {quizData.map((question: QuestionMap, index: number) => {
                    return (
                      <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionText}>
                         {index+1}. {question.questionText}
                        </Text>
                        <View style={styles.choicesContainer}>
                          {question.choices.map((choice, i: number) => 
                            <Fragment key={i}>
                              <Text style={(i+1 === question.correct) ? styles.correctChoice : styles.choice}>
                                {String.fromCharCode(65 + i)}. {choice}
                              </Text>
                            </Fragment>
                          )}
                          <Text style={styles.reasoning}> Explanation: {question.explanation}</Text>
                        </View>
                      </View>
                    )
                  })}
                  </>
                  }
                  {includeSimpleKey && 
                  <>
                  <Text style={styles.title}> </Text>
                  {quizData.map((question: QuestionMap, index: number) => {
                    return (
                      <View key={index}>
                      <View style={styles.choicesContainer}>
                        <Text style={styles.choice}>
                          {index + 1}.
                          <Text style={styles.simpleCorrectChoice}>
                           {choiceMappings[question.correct]}
                           </Text>
                        </Text>
                        </View>
                      </View>
                    )
                  })}
                  </>
                  }
                </Page>
              </Document>
            </PDFViewer>
          </div>
        </div>
      )}

      {/* Fullscreen Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col">
          <div className="bg-white dark:bg-slate-800 border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">PDF Preview - Fullscreen</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Preview
              </div>
            </div>
            <Button 
              onClick={() => setIsFullscreen(false)}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 relative bg-white dark:bg-slate-900">
            <PDFViewer 
              className="w-full h-full border-0"
              style={{ 
                width: '100%', 
                height: '100%',
                backgroundColor: 'rgb(249 250 251)'
              }}
            >
              <Document title={title || "Quiz Document"}>
                <Page size="A4" style={styles.page}>
                  {header && (
                    <Text style={styles.header}>{header}</Text>
                  )}
                  {quizData.map((question: QuestionMap, index: number) => {
                    return (
                      <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionText}>
                          {index + 1}. {question.questionText}
                        </Text>
                        <View style={styles.choicesContainer}>
                          {question.choices.map((choice, i: number) => 
                            <Fragment key={i}>
                              <Text style={styles.choice}>
                                {String.fromCharCode(65 + i)}. {choice}
                              </Text>
                            </Fragment>
                          )}
                        </View>
                      </View>
                    )
                  })}
                  {/* Answer key w explanations */}
                  {includeKey && 
                  <>
                  <Text style={styles.title}> Answer Key </Text>
                  {quizData.map((question: QuestionMap, index: number) => {
                    return (
                      <View key={index} style={styles.questionContainer}>
                        <Text style={styles.questionText}>
                         {index+1}. {question.questionText}
                        </Text>
                        <View style={styles.choicesContainer}>
                          {question.choices.map((choice, i: number) => 
                            <Fragment key={i}>
                              <Text style={(i+1 === question.correct) ? styles.correctChoice : styles.choice}>
                                {String.fromCharCode(65 + i)}. {choice}
                              </Text>
                            </Fragment>
                          )}
                          <Text style={styles.reasoning}> Explanation: {question.explanation}</Text>
                        </View>
                      </View>
                    )
                  })}
                  </>
                  }
                  {/* Simple answer key */}
                  {includeSimpleKey && 
                  <>
                  <Text style={styles.title}> </Text>
                  {quizData.map((question: QuestionMap, index: number) => {
                    return (
                      <View key={index}>
                      <View style={styles.choicesContainer}>
                        <Text style={styles.choice}>
                          {index + 1}.
                          <Text style={styles.simpleCorrectChoice}>
                           {choiceMappings[question.correct as keyof typeof choiceMappings]}
                           </Text>
                        </Text>
                        </View>
                      </View>
                    )
                  })}
                  </>
                  }
                </Page>
              </Document>
            </PDFViewer>
          </div>
        </div>
      )}
    </>
  )
}
  