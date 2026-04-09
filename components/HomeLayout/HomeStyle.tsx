"use client"
import Image from "next/image"
import { motion } from "motion/react"
import { Button } from "../ui/button"
import { TypeAnimation } from "react-type-animation"
import { Sparkles, ArrowRight, Zap, BookOpen, Brain } from "lucide-react"
import Card from "../ui/styledWrapper"
import Help from "./Help"
import GridReview from "./GridReview"
import Me from "@/public/Me.png"
import { description } from "@/lib/constants"
import HomeAnimationPreview from "./HomeAnimationPreview"
import dynamic from "next/dynamic"
// Stop hydration errors 
const InfiniteScroll = dynamic(() => import("./InfiniteScroll"), { ssr: false })

export default function HomeStyle() {

  const features = [
    { icon: BookOpen, title: "Smart Study Guides", desc: "AI-powered guides that adapt to your learning style" },
    { icon: Zap, title: "Lightning Fast", desc: "Get comprehensive guides in just 10 seconds" },
    { icon: Brain, title: "Personalized Feedback", desc: "Receive tailored insights to optimize your study sessions" },
  ]

  const steps = [
    { num: 1, title: "Upload Your Content", desc: "Drag and drop any document, link, or notes", emoji: "📄" },
    { num: 2, title: "AI Processing", desc: "Our AI analyzes and creates your perfect study guide", emoji: "🤖" },
    { num: 3, title: "Study Smart", desc: "Enjoy personalized quizzes, videos, and flashcards", emoji: "🎯" },
  ]

  const userReviews = [
    { desc: "Absolutely Amazing!", by: "Brain Lin" },
    { desc: "Great for studying. I used this everyday to pass my classes", by: "James Johnson" },
    { desc: "The quizzes and videos are unlike anything I've seen. It's so in-depth and comprehensive", by: "Alice Smith" },
    { desc: "I use this for all my classes", by: "Bob Ryder" },
  ]
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 overflow-auto">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="mt-10 w-8 h-8 text-purple-500 absolute -top-2 -right-2" />
                  <h1 className="mt-10 text-6xl sm:text-7xl lg:text-8xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Learnix
                  </h1>
                </motion.div>
              </div>
              <motion.p
                className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Transform your study sessions with AI-powered learning guides that adapt to your unique style
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="px-8 py-4 text-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="px-8 py-4 text-lg border-2 border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full font-semibold transition-all duration-300">
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="relative"
            >
              <Card />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Why Choose Learnix?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of personalized learning with our cutting-edge AI technology
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                How it Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our AI-powered learning guides are designed to help you learn smarter, not harder
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                      <h3 className="text-2xl font-bold text-white">{step.num}</h3>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
        {/* Animation showing preview x*/}
        <HomeAnimationPreview/>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                What Students Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of students who have transformed their study habits
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userReviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <GridReview description={review.desc} by={review.by} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      {/* Infinite scroll */}
        <InfiniteScroll/>

        {/* My bio */}
        <div className="mt-30 font-bold flex justify-center items-center text-5xl bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Meet the Creator
        </div>
        <section className="flex justify-center items-center text-gray-700">
          <div className="mt-10 text-2xl">
            <TypeAnimation
              sequence={[
                "I am Ryan",
                2000,
                "I love AI",
                2000,
                "I love science",
                2000,
                "I love learning",
                2000,
              ]}
              speed={30}
              repeat={Infinity}
            />
          </div>
        </section>
        <div className="flex justify-center items-center mt-10">
          <div className="grid grid-cols-2 gap-2">
            <Image src={Me} alt="A photo of me" height={240} width={300} />
            <div> {description}</div>
          </div>
        </div>
        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-100/50 to-purple-100/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about Learnix
              </p>
              <div className="flex justify-center items-center ">
                <Help />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-linear-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of students who are already learning smarter with Learnix
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="px-8 py-4 text-lg bg-white text-purple-600 hover:bg-gray-100 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
