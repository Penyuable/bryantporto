"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  SiKotlin,
  SiPhp,
  SiJavascript,
  SiReact,
  SiFlutter,
  SiFigma,
  SiAndroid,
  SiPython,
  SiMysql,
  SiNextdotjs,
} from "react-icons/si";
import { FaJava, FaGithub, FaLinkedin, FaInstagram, FaLaravel } from "react-icons/fa";

export default function Home() {
  const experiences = [
    {
      company: "Bangkit Academy",
      role: "Mobile Developer",
      tools: ["Kotlin", "Android", "Jetpack Compose"],
      color: "bg-blue-300",
    },
    {
      company: "PT Tiga Serangkai Inti Corpora",
      role: "Lead UI/UX Designer",
      tools: ["Figma"],
      color: "bg-pink-300",
    },
    {
      company: "Tiga Serangkai University",
      role: "Frontend Developer",
      tools: ["PHP", "Laravel", "Figma"],
      color: "bg-yellow-300",
    },
  ];

  const projects = [
    {
      title: "Sleepwell (Capstone)",
      desc: "Mobile app for detecting sleep quality based on questionnaires.",
      tags: [
        { name: "Android", icon: <SiAndroid /> },
        { name: "Kotlin", icon: <SiKotlin /> },
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-green-300",
      link: "https://github.com/capstone-sleepwell",
    },
    {
      title: "Manchunian App Story",
      desc: "Android app that enables sharing locations from uploaded stories.",
      tags: [
        { name: "Android", icon: <SiAndroid /> },
        { name: "Kotlin", icon: <SiKotlin /> },
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-orange-300",
      link: "https://github.com/Penyuable/storyapp",
    },
    {
      title: "Resepkita",
      desc: "Android application for food recipes.",
      tags: [
        { name: "Android", icon: <SiAndroid /> },
        { name: "Kotlin", icon: <SiKotlin /> },
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-purple-300",
      link: "https://github.com/Penyuable/Resep-Kita",
    },
    {
      title: "Perpuskita",
      desc: "UI/UX design for PT Serangkai Corpora.",
      tags: [
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-teal-300",
      link: null,
    },
    {
      title: "Admin Perpuskita",
      desc: "UI/UX design for Perpuskita Admin Panel (PT Serangkai Corpora).",
      tags: [
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-indigo-300",
      link: null,
    },
    {
      title: "Siakad Fakultas Teknik",
      desc: "Web academic system for Tiga Serangkai University.",
      tags: [
        { name: "PHP", icon: <SiPhp /> },
        { name: "Laravel", icon: <FaLaravel /> }
      ],
      color: "bg-red-300",
      link: null,
    },
  ];

  const skills = [
    { name: "Kotlin", icon: <SiKotlin className="w-8 h-8" /> },
    { name: "Android", icon: <SiAndroid className="w-8 h-8" /> },
    { name: "Java", icon: <FaJava className="w-8 h-8" /> },
    { name: "PHP", icon: <SiPhp className="w-8 h-8" /> },
    { name: "JavaScript", icon: <SiJavascript className="w-8 h-8" /> },
    { name: "React", icon: <SiReact className="w-8 h-8" /> },
    { name: "Flutter", icon: <SiFlutter className="w-8 h-8" /> },
    { name: "SQL", icon: <SiMysql className="w-8 h-8" /> },
    { name: "Python", icon: <SiPython className="w-8 h-8" /> },
    { name: "Figma", icon: <SiFigma className="w-8 h-8" /> },
    { name: "Next.js", icon: <SiNextdotjs className="w-8 h-8" /> },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-yellow-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter uppercase">
            SB.
          </div>
          <div className="hidden md:flex gap-6 font-bold text-lg">
            <a href="#experience" className="hover:underline underline-offset-4 decoration-4">Experience</a>
            <a href="#projects" className="hover:underline underline-offset-4 decoration-4">Projects</a>
            <a href="#skills" className="hover:underline underline-offset-4 decoration-4">Skills</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-32">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-12 md:pt-24 flex flex-col items-start gap-6 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 border-4 border-black rounded-full -z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-4 -translate-y-4"></div>
          <div className="absolute bottom-0 right-32 w-24 h-24 bg-pink-300 border-4 border-black -z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-12"></div>
          
          <h2 className="text-2xl md:text-4xl font-bold bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 inline-block">
            Hi, I'm
          </h2>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            Samuel <br /> Bryant
          </h1>
          <p className="text-xl md:text-3xl font-bold max-w-2xl bg-blue-300 px-4 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            Web Developer
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://github.com/Penyuable" target="_blank" rel="noopener noreferrer" className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform" aria-label="GitHub">
              <FaGithub className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/samuel-bryant-eka-putra/" target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform" aria-label="LinkedIn">
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/bryhere_" target="_blank" rel="noopener noreferrer" className="bg-pink-500 text-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform" aria-label="Instagram">
              <FaInstagram className="w-6 h-6" />
            </a>
          </div>
        </motion.section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-24">
          <h2 className="text-5xl font-black uppercase mb-12 border-b-4 border-black pb-4 inline-block">Experience</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className={`${exp.color} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
              >
                <h3 className="text-2xl font-bold mb-1">{exp.company}</h3>
                <p className="text-xl font-semibold mb-4 bg-white border-2 border-black inline-block px-2 py-1">
                  {exp.role}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="bg-white border-2 border-black px-3 py-1 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-24">
          <h2 className="text-5xl font-black uppercase mb-12 border-b-4 border-black pb-4 inline-block">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className={`${project.color} border-4 border-black p-6 flex flex-col h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform shrink-0" aria-label="View on GitHub">
                      <FaGithub className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed shrink-0" title="Restricted Company Project">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-lg font-medium mb-6 flex-grow bg-white/80 p-3 border-2 border-black">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white border-2 border-black px-3 py-1 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
                    >
                      {tag.icon}
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-24 pb-24">
          <h2 className="text-5xl font-black uppercase mb-12 border-b-4 border-black pb-4 inline-block">Skills</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-white border-4 border-black p-6 flex flex-col items-center justify-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 cursor-default"
              >
                {skill.icon}
                <span className="font-bold text-lg">{skill.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-black text-white py-8 border-t-4 border-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-bold text-xl uppercase tracking-widest">Samuel Bryant</p>
          <p className="font-medium mt-2">@2026 bryxy</p>
        </div>
      </footer>
    </div>
  );
}
