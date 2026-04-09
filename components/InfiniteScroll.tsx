"use client"
import { FaYoutube, FaGoogle, FaReact, FaGithub, FaNpm } from "react-icons/fa"
import { FaMeta } from "react-icons/fa6"
import { AiFillOpenAI } from "react-icons/ai"
import { IoLogoVercel, IoLogoJavascript, IoLogoNodejs } from "react-icons/io5"
import { RiNextjsFill, RiGeminiLine, RiTailwindCssFill } from "react-icons/ri"
import { SiNotebooklm, SiClerk, SiOllama, SiWindsurf, SiTypescript, SiMongodb, SiGsap, SiRadixui, SiShadcnui, SiPython } from "react-icons/si"
import { VscVscode } from "react-icons/vsc" 
import { InfiniteSlider } from "./motion-primitives/infinite-slider"

export default function InfiniteScroll() {
    const brandColors = {
        FaYoutube: "#FF0000",
        AiFillOpenAI: "#10a37f",
        FaGoogle: "#4285F4",
        RiNextjsFill: "#FFFFFF",
        SiNotebooklm: "white",
        IoLogoVercel: "#FFFFFF",
        RiGeminiLine: "#4285F4",
        FaReact: "#61DAFB",
        SiClerk: "#6C47FF",
        SiWindsurf: "white",
        SiOllama: "white",
        IoLogoJavascript: "#F7DF1E",
        VscVscode: "#007ACC",
        FaMeta: "#0668E1",
        SiTypescript: "#3178C6",
        RiTailwindCssFill: "#06B6D4",
        SiMongodb: "#47A248",
        IoLogoNodejs: "#339933",
        SiGsap: "#88CE02",
        SiRadixui: "#FFF",
        SiShadcnui: "#FFFFFF",
        FaGithub: "#FFFFFF",
        FaNpm: "#CB3837",
        SiPython: "#3776AB",
    }

    const supports = [
        FaYoutube,
        AiFillOpenAI,
        FaGoogle,
        RiNextjsFill,
        SiNotebooklm,
        IoLogoVercel,
        RiGeminiLine,
        FaReact,
        SiClerk,
        SiWindsurf,
        SiOllama,
        IoLogoJavascript,
        VscVscode,
        FaMeta,
        SiTypescript,
        RiTailwindCssFill,
        SiMongodb,
        IoLogoNodejs,
        SiGsap,
        SiRadixui,
        SiShadcnui,
        FaGithub,
        FaNpm,
        SiPython,
     ]

    const iconNames: (keyof typeof brandColors)[] = [
        "FaYoutube",
        "AiFillOpenAI",
        "FaGoogle",
        "RiNextjsFill",
        "SiNotebooklm",
        "IoLogoVercel",
        "RiGeminiLine",
        "FaReact",
        "SiClerk",
        "SiWindsurf",
        "SiOllama",
        "IoLogoJavascript",
        "VscVscode",
        "FaMeta",
        "SiTypescript",
        "RiTailwindCssFill",
        "SiMongodb",
        "IoLogoNodejs",
        "SiGsap",
        "SiRadixui",
        "SiShadcnui",
        "FaGithub",
        "FaNpm",
        "SiPython",
    ]
    return (
        <>
        <div className = "flex mb-20 justify-center text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Special Thanks To</div>
        <InfiniteSlider speedOnHover={30} gap={30} className = "mb-20">
        {supports.map((Icon, i) =>
            <div key={i} className="flex items-center justify-center w-30 h-24 rounded-lg" style={{ backgroundColor: brandColors[iconNames[i]] }}>
                <Icon className="text-4xl"/>
            </div>
        )}
        </InfiniteSlider>
        </>
    )
}
