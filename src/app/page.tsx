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
  SiNestjs,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { FaJava, FaGithub, FaLinkedin, FaInstagram, FaLaravel, FaGamepad, FaExternalLinkAlt, FaMobileAlt } from "react-icons/fa";
import Link from "next/link";
import GeminiChat from "@/components/GeminiChat";
import ClayNav from "@/components/ClayNav";
import ClayBlobs from "@/components/ClayBlobs";

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 160, damping: 18, delay: i * 0.08 },
  }),
};

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`clay ${color} inline-block text-4xl md:text-5xl font-black text-slate-800 px-8 py-4 mb-12`}
    >
      {children}
    </motion.h2>
  );
}

export default function Home() {
  const experiences = [
    {
      company: "Kemenangan Masindo Group",
      role: "IT Developer",
      period: "Present",
      desc: "Developing a web-based dashboard for real-time monitoring and task tracking across every company division.",
      tools: ["Next.js", "Nest.js", "Supabase", "Tailwind CSS"],
      color: "bg-emerald-200",
    },
    {
      company: "Bangkit Academy",
      role: "Mobile Developer",
      desc: "Developed Android mobile applications using Kotlin, Jetpack Compose, and clean architecture.",
      tools: ["Kotlin", "Android", "Jetpack Compose"],
      color: "bg-sky-200",
    },
    {
      company: "PT Tiga Serangkai Inti Corpora",
      role: "Lead UI/UX Designer",
      desc: "Led UI/UX design initiatives for digital library ecosystems (Perpuskita & Perpuskita Admin Panel).",
      tools: ["Figma"],
      color: "bg-pink-200",
    },
    {
      company: "Tiga Serangkai University",
      role: "Frontend Developer",
      desc: "Built frontend academic portals and web management systems for the Faculty of Engineering.",
      tools: ["PHP", "Laravel", "Figma"],
      color: "bg-amber-200",
    },
  ];

  const company = {
    name: "Bryxy",
    role: "Founder",
    tagline: "Semua berawal dari sini, titik mula.",
    desc: "A digital product studio I founded to craft apps that feel close, easy to use, and fun to have around every day — always starting from what users actually need.",
    website: "https://bryxy-company.vercel.app/",
    products: [
      { name: "Doki", kind: "Game", icon: "🃏", color: "bg-amber-200", link: "https://bryxy-company.vercel.app/download#doki" },
      { name: "Moneyzz", kind: "Lifestyle", icon: "💰", color: "bg-emerald-200", link: "https://bryxy-company.vercel.app/download#moneyzz" },
    ],
  };

  const projects = [
    {
      title: "Doki",
      badge: "Bryxy",
      desc: "Multiplatform monster card battle game (TCG) — collect cards, build your deck, and duel other players.",
      tags: [
        { name: "Flutter", icon: <SiFlutter /> },
        { name: "Next.js", icon: <SiNextdotjs /> },
        { name: "Multiplatform", icon: <FaMobileAlt /> },
      ],
      color: "bg-amber-200",
      link: "https://bryxy-company.vercel.app/download#doki",
    },
    {
      title: "Moneyzz",
      badge: "Bryxy",
      desc: "Multiplatform personal finance app — record income & expenses, track cash flow, and scan shopping receipts.",
      tags: [
        { name: "Flutter", icon: <SiFlutter /> },
        { name: "Multiplatform", icon: <FaMobileAlt /> },
      ],
      color: "bg-emerald-200",
      link: "https://bryxy-company.vercel.app/download#moneyzz",
    },
    {
      title: "Division Monitoring Dashboard",
      desc: "Web-based dashboard for monitoring and managing tasks across every company division.",
      tags: [
        { name: "Next.js", icon: <SiNextdotjs /> },
        { name: "Nest.js", icon: <SiNestjs /> },
        { name: "Supabase", icon: <SiSupabase /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      ],
      color: "bg-cyan-200",
      link: null,
    },
    {
      title: "Sleepwell (Capstone)",
      desc: "Mobile app for detecting sleep quality based on questionnaires.",
      tags: [
        { name: "Android", icon: <SiAndroid /> },
        { name: "Kotlin", icon: <SiKotlin /> },
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-lime-200",
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
      color: "bg-orange-200",
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
      color: "bg-violet-200",
      link: "https://github.com/Penyuable/Resep-Kita",
    },
    {
      title: "Perpuskita",
      desc: "UI/UX design for PT Serangkai Corpora.",
      tags: [
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-teal-200",
      link: null,
    },
    {
      title: "Admin Perpuskita",
      desc: "UI/UX design for Perpuskita Admin Panel (PT Serangkai Corpora).",
      tags: [
        { name: "Figma", icon: <SiFigma /> }
      ],
      color: "bg-indigo-200",
      link: null,
    },
    {
      title: "Siakad Fakultas Teknik",
      desc: "Web academic system for Tiga Serangkai University.",
      tags: [
        { name: "PHP", icon: <SiPhp /> },
        { name: "Laravel", icon: <FaLaravel /> }
      ],
      color: "bg-rose-200",
      link: null,
    },
  ];

  const skills = [
    { name: "Kotlin", icon: <SiKotlin className="w-8 h-8" /> },
    { name: "Android", icon: <SiAndroid className="w-8 h-8" /> },
    { name: "Java", icon: <FaJava className="w-8 h-8" /> },
    { name: "PHP", icon: <SiPhp className="w-8 h-8" /> },
    { name: "JavaScript", icon: <SiJavascript className="w-8 h-8" /> },
    { name: "TypeScript", icon: <SiTypescript className="w-8 h-8" /> },
    { name: "React", icon: <SiReact className="w-8 h-8" /> },
    { name: "Next.js", icon: <SiNextdotjs className="w-8 h-8" /> },
    { name: "Nest.js", icon: <SiNestjs className="w-8 h-8" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="w-8 h-8" /> },
    { name: "Supabase", icon: <SiSupabase className="w-8 h-8" /> },
    { name: "SQL", icon: <SiMysql className="w-8 h-8" /> },
    { name: "Flutter", icon: <SiFlutter className="w-8 h-8" /> },
    { name: "Python", icon: <SiPython className="w-8 h-8" /> },
    { name: "Figma", icon: <SiFigma className="w-8 h-8" /> },
  ];

  return (
    <div className="min-h-screen font-sans text-slate-700 relative">
      <ClayBlobs />
      <ClayNav
        collapseOnMobile
        links={[
          { href: "#company", label: "Company" },
          { href: "#experience", label: "Experience" },
          { href: "#projects", label: "Projects" },
          { href: "#skills", label: "Skills" },
        ]}
      />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-32">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-12 md:pt-20 flex flex-col items-start gap-6 relative"
        >
          {/* Floating clay shapes */}
          <div className="absolute top-0 right-0 md:right-6 w-32 h-32 bg-amber-200 clay rounded-full! -z-10 animate-float print:hidden" />
          <div
            className="absolute bottom-6 right-36 w-20 h-20 bg-pink-200 clay -z-10 animate-float-slow print:hidden"
            style={{ animationDelay: "-3s" }}
          />
          <div
            className="absolute top-40 right-24 w-12 h-12 bg-sky-200 clay rounded-full! -z-10 animate-float print:hidden"
            style={{ animationDelay: "-1.5s" }}
          />

          <h2 className="clay-sm bg-surface/80 text-2xl md:text-3xl font-extrabold text-slate-600 px-5 py-2 inline-block animate-wiggle">
            Hi, I&apos;m 👋
          </h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-slate-800 print:hidden drop-shadow-[0_6px_0_rgba(167,139,250,0.35)]">
            Samuel <br />
            <span className="text-violet-500">Bryant</span>
          </h1>
          <h1 className="hidden print:block text-5xl md:text-7xl font-black tracking-tight leading-none mb-2 text-slate-800">
            Samuel Bryant <br /> Eka Putra
          </h1>
          <p className="hidden print:block clay-sm bg-surface text-lg font-bold px-4 py-1 mb-4 self-start">
            Surakarta, Central Java
          </p>
          <p className="clay bg-sky-200 text-xl md:text-3xl font-extrabold text-sky-900 max-w-2xl px-6 py-3">
            Fullstack Dev
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <a href="https://github.com/Penyuable" target="_blank" rel="noopener noreferrer" className="clay-btn bg-surface p-3.5 text-slate-800" aria-label="GitHub">
              <FaGithub className="w-6 h-6" />
            </a>
            <a href="https://www.linkedin.com/in/samuel-bryant-eka-putra/" target="_blank" rel="noopener noreferrer" className="clay-btn bg-sky-400 text-white p-3.5" aria-label="LinkedIn">
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/bryhere_" target="_blank" rel="noopener noreferrer" className="clay-btn bg-pink-400 text-white p-3.5 print:hidden" aria-label="Instagram">
              <FaInstagram className="w-6 h-6" />
            </a>
            <button onClick={() => window.print()} className="clay-btn bg-amber-200 text-amber-900 font-extrabold px-5 py-2 print:hidden flex items-center gap-2">
              Export PDF
            </button>
            <Link href="/games" className="clay-btn bg-lime-300 text-lime-900 font-extrabold px-5 py-2 print:hidden flex items-center gap-2">
              <FaGamepad className="w-5 h-5" /> Mini Game
            </Link>
          </div>
          <p className="hidden print:block clay bg-surface text-lg font-medium max-w-3xl p-5 mt-6">
            As a versatile IT Developer, Front-End and Mobile Developer with a specialized focus on UI/UX Design, I am dedicated to crafting digital products that seamlessly blend technical logic with aesthetic appeal. Currently serving as an IT Developer at Kemenangan Masindo Group developing enterprise web dashboards using Next.js, Nest.js, Supabase, and Tailwind CSS. Grounded in my Informatics background, Bangkit Academy alumni experience, and hands-on industry development, I am committed to delivering innovative, user-centric digital experiences.
          </p>
        </motion.section>

        {/* Company Section */}
        <section id="company" className="scroll-mt-28 break-inside-avoid">
          <SectionTitle color="bg-violet-200">My Company</SectionTitle>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="clay bg-violet-200 p-7 md:p-10 relative overflow-hidden"
          >
            {/* Decorative floating shapes */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-pink-200 clay rounded-full! animate-float-slow print:hidden" />
            <div
              className="absolute bottom-6 right-1/3 w-10 h-10 bg-amber-200 clay rounded-full! animate-float print:hidden"
              style={{ animationDelay: "-2s" }}
            />

            <div className="relative flex flex-col md:flex-row gap-8 md:items-center">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.08 }}
                className="clay bg-surface w-28 h-28 md:w-36 md:h-36 shrink-0 flex items-center justify-center animate-squish"
              >
                <span className="text-4xl md:text-5xl font-black tracking-tight text-violet-600">
                  bryxy<span className="text-pink-400">.</span>
                </span>
              </motion.div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-4xl font-black text-slate-800">{company.name}</h3>
                  <span className="clay-sm rounded-full! bg-surface px-3 py-1 text-xs font-black uppercase text-violet-700">
                    {company.role}
                  </span>
                </div>
                <p className="text-xl font-extrabold italic text-violet-800 mb-4">
                  &ldquo;{company.tagline}&rdquo;
                </p>
                <p className="clay-inset bg-surface/50 text-base font-semibold p-4 mb-6">
                  {company.desc}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {company.products.map((p, i) => (
                    <motion.a
                      key={p.name}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 + i * 0.1 }}
                      className={`clay-btn ${p.color} px-4 py-2 flex items-center gap-2 font-extrabold text-slate-800`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      {p.name}
                      <span className="text-xs font-bold text-slate-500">· {p.kind}</span>
                    </motion.a>
                  ))}
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn bg-violet-500 text-white px-5 py-2 font-extrabold flex items-center gap-2"
                  >
                    Visit Website <FaExternalLinkAlt className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-28 print:break-before-page">
          <SectionTitle color="bg-emerald-200">Experience</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -8, rotate: idx % 2 ? 0.6 : -0.6 }}
                className={`clay ${exp.color} p-7 break-inside-avoid flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-2xl font-black text-slate-800">{exp.company}</h3>
                    {exp.period && (
                      <span className="clay-sm rounded-full! bg-surface px-3 py-1 text-xs font-black uppercase text-emerald-700 shrink-0 animate-pulse">
                        {exp.period}
                      </span>
                    )}
                  </div>
                  <p className="clay-sm bg-surface/80 text-lg font-extrabold text-slate-700 mb-4 inline-block px-3 py-1">
                    {exp.role}
                  </p>
                  {exp.desc && (
                    <p className="clay-inset bg-surface/50 text-base font-semibold mb-5 p-4">
                      {exp.desc}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {exp.tools.map((tool, i) => (
                    <span key={i} className="clay-sm rounded-full! bg-surface px-3 py-1 font-bold text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-28 print:break-before-page">
          <SectionTitle color="bg-pink-200">Projects</SectionTitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                custom={idx % 3}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`clay ${project.color} p-6 flex flex-col h-full break-inside-avoid`}
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{project.title}</h3>
                    {"badge" in project && project.badge && (
                      <span className="clay-sm rounded-full! bg-violet-300 text-violet-900 inline-block mt-2 px-2.5 py-0.5 text-xs font-black">
                        by {project.badge}
                      </span>
                    )}
                  </div>
                  {project.link ? (
                    project.link.includes("github.com") ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="clay-btn bg-surface p-2.5 shrink-0" aria-label="View on GitHub">
                        <FaGithub className="w-5 h-5" />
                      </a>
                    ) : (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="clay-btn bg-surface p-2.5 shrink-0" aria-label={`Download ${project.title}`}>
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </a>
                    )
                  ) : (
                    <span className="clay-inset rounded-full! bg-surface/50 px-3 py-1 text-xs font-bold text-slate-500 cursor-not-allowed shrink-0" title="Restricted Company Project">
                      🔒 Private
                    </span>
                  )}
                </div>
                <p className="clay-inset bg-surface/50 text-base font-semibold mb-6 flex-grow p-4">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="clay-sm rounded-full! bg-surface px-3 py-1 font-bold text-sm flex items-center gap-1.5">
                      {tag.icon}
                      {tag.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-28 pb-24 print:break-before-page">
          <SectionTitle color="bg-amber-200">Skills</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {skills.map((skill, idx) => (
              <motion.div
                key={idx}
                custom={idx % 5}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="clay bg-surface/80 p-6 flex flex-col items-center justify-center gap-4 cursor-default break-inside-avoid group"
              >
                <div
                  className="clay-sm rounded-full! bg-violet-100 text-violet-700 p-3 animate-float group-hover:animate-wiggle"
                  style={{ animationDelay: `${-idx * 0.4}s` }}
                >
                  {skill.icon}
                </div>
                <span className="font-extrabold text-lg text-slate-700">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 pb-6 break-inside-avoid">
        <div className="clay max-w-5xl mx-auto bg-violet-300 py-8 px-6 text-center">
          <p className="font-black text-xl uppercase tracking-widest text-violet-900">Samuel Bryant</p>
          <p className="font-semibold mt-2 text-violet-800">@2026 bryxy</p>
        </div>
      </footer>
      <GeminiChat
        pageContext="Ini adalah halaman portofolio Bryant (Bryxy), seorang IT Developer & Fullstack/Mobile Developer dari Indonesia. Saat ini bekerja sebagai IT Developer di Kemenangan Masindo Group (sedang mengembangkan dashboard web monitoring pekerjaan antar divisi menggunakan Next.js, Nest.js, Supabase, dan Tailwind CSS). Bryant juga founder Bryxy (https://bryxy-company.vercel.app/), studio produk digital dengan tagline 'Semua berawal dari sini, titik mula.' Produk Bryxy: Doki (game battle kartu monster/TCG multiplatform, dibuat dengan Flutter dan Next.js) dan Moneyzz (aplikasi pengatur keuangan multiplatform untuk mencatat pemasukan & pengeluaran, memantau arus kas, dan scan struk belanja, dibuat dengan Flutter). Juga berpengalaman di Kotlin, Android, React, Laravel, Figma. Bantu pengunjung mengenal Bryant lebih jauh."
      />
    </div>
  );
}
