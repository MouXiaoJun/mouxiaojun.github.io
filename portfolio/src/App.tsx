import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

type FadeInProps = {
  children: ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
}

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = '' }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ContactButton() {
  return (
    <a
      href="/about/"
      className="contact-button inline-flex items-center gap-3 rounded-full px-8 py-3 text-xs font-medium tracking-[0.18em] text-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
    >
      联系我
      <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
    </a>
  )
}

function ProjectButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-xs font-medium tracking-[0.12em] text-[#D7E2EA] transition hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3 sm:text-sm"
    >
      查看源码
      <ArrowUpRight className="h-4 w-4" />
    </a>
  )
}

function Magnet({ children, padding = 150, strength = 3 }: { children: ReactNode; padding?: number; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding

      if (!inside) {
        el.style.transition = 'transform 0.6s ease-in-out'
        el.style.transform = 'translate3d(0,0,0)'
        return
      }

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = (event.clientX - centerX) / strength
      const y = (event.clientY - centerY) / strength

      el.style.transition = 'transform 0.3s ease-out'
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [padding, strength])

  return (
    <div ref={ref} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}

const marqueeItems = [
  ['Go', '后端主力语言'],
  ['Goroutine', '并发与生命周期'],
  ['Context', '取消传播与超时预算'],
  ['MySQL', '事务 · 索引 · 一致性'],
  ['Redis', '缓存 · 协调 · 限流'],
  ['MQTT', '实时消息与设备链路'],
  ['可观测性', '链路追踪 · 指标 · 日志'],
  ['分布式同步', '锁 · 租约 · 信号量'],
  ['Fencing Token', '防止过期持有者写入'],
  ['主节点选举', '协调与高可用'],
  ['流量治理', '限流 · 熔断 · 退避'],
  ['模块化单体', '边界 · 依赖 · 演进'],
  ['架构验证', '把架构规则变成测试'],
  ['API 模糊测试', '从单接口走向状态流'],
  ['OpenAPI', '契约驱动测试'],
  ['LangGraph', 'Agent 状态编排'],
  ['Dify', 'AI 应用平台'],
  ['LiveKit', '实时语音链路'],
  ['AI Agent', '从 Demo 到生产'],
  ['开发者工具', '把重复问题工具化'],
  ['开源工程', '长期维护真实项目'],
]

function MarqueeRow({ items, direction }: { items: string[][]; direction: 'left' | 'right' }) {
  const row = useRef<HTMLDivElement>(null)
  const repeated = [...items, ...items, ...items]

  useEffect(() => {
    const node = row.current
    const section = node?.closest('section')
    if (!node || !section) return

    const update = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      const x = direction === 'right' ? offset - 200 : -(offset - 200)
      node.style.transform = `translate3d(${x}px, 0, 0)`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [direction])

  return (
    <div ref={row} className="flex w-max gap-3" style={{ willChange: 'transform' }}>
      {repeated.map(([title, subtitle], index) => (
        <article
          key={`${title}-${index}`}
          className="tech-tile flex h-[200px] w-[310px] shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-[#111318] p-6 sm:h-[270px] sm:w-[420px] sm:p-7"
        >
          <div className="text-[10px] font-medium tracking-[0.18em] text-[#7E8B96] sm:text-xs">
            工程能力 / {String((index % items.length) + 1).padStart(2, '0')}
          </div>
          <div>
            <h3 className="text-[clamp(1.8rem,4vw,3.8rem)] font-black leading-none tracking-tight text-[#D7E2EA]">{title}</h3>
            <p className="mt-3 text-sm font-light tracking-wide text-[#8997A3] sm:mt-4 sm:text-base">{subtitle}</p>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D7E2EA]/35 to-transparent" />
        </article>
      ))}
    </div>
  )
}

function MarqueeSection() {
  return (
    <section className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3">
        <MarqueeRow items={marqueeItems.slice(0, 11)} direction="right" />
        <MarqueeRow items={marqueeItems.slice(11)} direction="left" />
      </div>
    </section>
  )
}

function AnimatedChar({ char, progress, start, end }: { char: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  const display = char === ' ' ? '\u00A0' : char

  return (
    <span className="relative inline-block">
      <span className="invisible">{display}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {display}
      </motion.span>
    </span>
  )
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const chars = [...text]

  return (
    <p ref={ref} className="mx-auto max-w-[680px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]">
      {chars.map((char, index) => {
        const start = index / chars.length
        const end = Math.min(1, start + 0.14)
        return <AnimatedChar key={`${index}-${char}`} char={char} progress={scrollYProgress} start={start} end={end} />
      })}
    </p>
  )
}

function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[660px] flex-col overflow-x-clip bg-[#0C0C0C]">
      <FadeIn delay={0} y={-20} className="relative z-40">
        <nav className="flex justify-between px-6 pt-6 text-sm font-medium tracking-wider text-[#D7E2EA] sm:px-8 md:px-10 md:pt-8 md:text-lg lg:text-[1.35rem]">
          <a className="transition-opacity duration-200 hover:opacity-70" href="#about">关于</a>
          <a className="transition-opacity duration-200 hover:opacity-70" href="#services">方向</a>
          <a className="transition-opacity duration-200 hover:opacity-70" href="#projects">项目</a>
          <a className="transition-opacity duration-200 hover:opacity-70" href="/blog/">文章</a>
        </nav>
      </FadeIn>

      <FadeIn delay={0.15} y={40} className="relative z-20 mt-6 overflow-hidden sm:mt-4 md:-mt-5">
        <h1 className="hero-heading w-full whitespace-nowrap px-2 text-[12.6vw] font-black leading-none tracking-[-0.055em] sm:text-[13.5vw] md:text-[14vw] lg:text-[14.5vw]">
          你好，我是邓晖
        </h1>
      </FadeIn>

      <div className="hero-portrait-shell pointer-events-none absolute bottom-0 left-1/2 z-10 w-[230px] sm:w-[300px] md:w-[350px] lg:w-[390px]">
        <FadeIn delay={0.6} y={30} className="w-full">
          <Magnet>
            <div className="pointer-events-auto overflow-hidden rounded-[34%] border border-white/15 bg-[#111318] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
              <img src="https://github.com/MouXiaoJun.png" alt="邓晖" className="block aspect-square w-full select-none object-cover grayscale-[0.15]" draggable={false} />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-30 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:px-8 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="max-w-[190px] text-[clamp(0.75rem,1.3vw,1.3rem)] font-light leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[250px] md:max-w-[330px]">
            专注 Go 后端、AI 平台与开发者工具，把真实工程问题做成可靠、清晰、可复用的系统。
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}><ContactButton /></FadeIn>
      </div>
    </section>
  )
}

const decorations = [
  { label: 'GO', className: 'top-[6%] left-[2%] md:left-[5%] w-[110px] sm:w-[150px] md:w-[190px]', delay: 0.1, x: -80 },
  { label: '{ }', className: 'bottom-[10%] left-[5%] md:left-[11%] w-[90px] sm:w-[130px] md:w-[160px]', delay: 0.25, x: -80 },
  { label: 'AI', className: 'top-[6%] right-[2%] md:right-[5%] w-[110px] sm:w-[150px] md:w-[190px]', delay: 0.15, x: 80 },
  { label: '</>', className: 'bottom-[10%] right-[5%] md:right-[11%] w-[110px] sm:w-[150px] md:w-[190px]', delay: 0.3, x: 80 },
]

function AboutSection() {
  const text = '我主要做 Go 服务端与 AI 平台工程，关注分布式正确性、模块边界、可观测性和工程效率。相比堆功能，我更喜欢把复杂问题拆清楚，再沉淀成可以长期复用的基础能力与开源工具。'

  return (
    <section id="about" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10">
      {decorations.map((item) => (
        <FadeIn key={item.label} delay={item.delay} x={item.x} y={0} duration={0.9} className={`pointer-events-none absolute ${item.className}`}>
          <div className="flex aspect-square w-full items-center justify-center rounded-[32%] border border-white/10 bg-gradient-to-br from-[#16191f] to-[#0e1014] text-[clamp(2rem,5vw,4.2rem)] font-black tracking-tight text-[#73808B] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            {item.label}
          </div>
        </FadeIn>
      ))}

      <div className="relative z-10 flex w-full flex-col items-center">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black leading-none tracking-tight">关于我</h2>
        </FadeIn>
        <div className="mt-10 sm:mt-14 md:mt-16"><AnimatedText text={text} /></div>
        <FadeIn delay={0.2} y={24} className="mt-16 sm:mt-20 md:mt-24"><ContactButton /></FadeIn>
      </div>
    </section>
  )
}

const services = [
  ['01', 'Go 后端工程', '从业务服务到基础组件，关注并发控制、Context、数据库、缓存、消息链路与长期可维护性。'],
  ['02', '分布式系统', '围绕锁、租约、Fencing Token、限流、主节点选举和一致性边界，做正确而不是“看起来能跑”的实现。'],
  ['03', 'AI 平台', '把 LLM、Agent、语音链路、知识与第三方能力接入真实产品，解决状态、成本、可观测与失败恢复。'],
  ['04', '开发者工具', '把工程里的重复问题抽象成工具：分布式同步、架构约束、API 正确性测试与研发自动化。'],
  ['05', '工程写作', '持续整理 Go 设计模式、后端正确性、模块化单体、缓存一致性和 AI 工程实践，让经验可以被复用。'],
]

function ServicesSection() {
  return (
    <section id="services" className="rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn><h2 className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black leading-none tracking-tight sm:mb-20 md:mb-28">专注方向</h2></FadeIn>
      <div className="mx-auto max-w-5xl">
        {services.map(([number, name, description], index) => (
          <FadeIn key={name} delay={index * 0.1} y={30}>
            <article className="grid grid-cols-[minmax(90px,0.65fr)_1.35fr] gap-6 border-t border-[rgba(12,12,12,0.15)] py-8 last:border-b sm:gap-10 sm:py-10 md:py-12">
              <div className="text-[clamp(3rem,10vw,140px)] font-black leading-none tracking-tight">{number}</div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium tracking-tight">{name}</h3>
                <p className="mt-4 max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] font-light leading-relaxed opacity-60">{description}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

type Project = {
  number: string
  title: string
  repo: string
  category: string
  href: string
  highlights: [string, string, string]
}

const projects: Project[] = [
  {
    number: '01',
    title: '分布式同步工具箱',
    repo: 'distsync',
    category: '开源 · 分布式系统',
    href: 'https://github.com/MouXiaoJun/distsync',
    highlights: ['互斥锁 · 读写锁 · 信号量', '限流器 · 主节点选举', '租约 · Fencing Token · Redis / Valkey'],
  },
  {
    number: '02',
    title: '模块化单体架构工具',
    repo: 'gomodulith',
    category: '开源 · 架构治理',
    href: 'https://github.com/MouXiaoJun/gomodulith',
    highlights: ['模块自动发现', '边界验证 · 循环依赖检测', '架构图 · AI 可读架构契约'],
  },
  {
    number: '03',
    title: '有状态 API 模糊测试',
    repo: 'specriot',
    category: '开源 · API 正确性',
    href: 'https://github.com/MouXiaoJun/specriot',
    highlights: ['OpenAPI 依赖关系图', '有状态 API Fuzzing', '失败缩减 · 确定性重放'],
  },
]

function ProjectVisual({ text, large = false }: { text: string; large?: boolean }) {
  return (
    <div className={`project-visual flex w-full flex-col justify-between rounded-[40px] border border-white/10 bg-[#111318] p-6 sm:rounded-[50px] md:rounded-[60px] ${large ? 'h-full min-h-[320px]' : 'h-full'}`}>
      <span className="text-xs font-medium tracking-[0.18em] text-[#6F7B86]">工程能力</span>
      <strong className="max-w-[18ch] text-[clamp(1.25rem,2.8vw,3rem)] font-black leading-[0.96] tracking-tight text-[#D7E2EA]">{text}</strong>
      <span className="text-xs tracking-[0.16em] text-[#596570]">MouXiaoJun / 开源项目</span>
    </div>
  )
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'start start'] })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  const isLast = index === total - 1

  return (
    <div ref={container} className={`relative ${isLast ? 'h-[122vh]' : 'h-[94vh]'}`}>
      <motion.article
        className="sticky rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 text-[#D7E2EA] sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{ scale, top: `calc(5.5rem + ${index * 28}px)` }}
      >
        <div className="grid items-end gap-5 pb-6 sm:grid-cols-[0.32fr_0.62fr_1.2fr_auto] sm:gap-6 md:pb-8">
          <div className="hero-heading text-[clamp(3rem,8vw,110px)] font-black leading-none">{project.number}</div>
          <div>
            <div className="text-sm font-light tracking-[0.12em] opacity-60">{project.category}</div>
            <div className="mt-2 font-mono text-xs tracking-[0.16em] text-[#66727D]">{project.repo}</div>
          </div>
          <h3 className="text-[clamp(1.5rem,3vw,3.2rem)] font-medium leading-none tracking-tight">{project.title}</h3>
          <div className="justify-self-start sm:justify-self-end"><ProjectButton href={project.href} /></div>
        </div>

        <div className="grid grid-cols-[0.4fr_0.6fr] gap-3 sm:gap-4">
          <div className="grid gap-3 sm:gap-4">
            <div className="h-[clamp(130px,16vw,230px)]"><ProjectVisual text={project.highlights[0]} /></div>
            <div className="h-[clamp(160px,22vw,340px)]"><ProjectVisual text={project.highlights[1]} /></div>
          </div>
          <ProjectVisual text={project.highlights[2]} large />
        </div>
      </motion.article>
    </div>
  )
}

function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32">
      <FadeIn><h2 className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black leading-none tracking-tight sm:mb-20 md:mb-28">开源项目</h2></FadeIn>
      <div className="mx-auto max-w-7xl">
        {projects.map((project, index) => (
          <ProjectCard key={project.repo} project={project} index={index} total={projects.length} />
        ))}
      </div>
      <div aria-hidden="true" className="h-[42vh] sm:h-[50vh]" />
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="relative z-30 bg-[#0C0C0C] px-5 pb-12 pt-10 text-[#D7E2EA] sm:px-8 md:px-10">
      <FadeIn y={18} className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.22em] text-[#66727D]">MOUXIAOJUN / OPEN SOURCE</p>
          <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-[#8997A3]">
            代码之外，我也持续整理 Go 设计模式和工程文章，把踩过的坑、做过的取舍和重新想明白的问题写下来。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/design-patterns/" className="rounded-full border border-white/20 px-6 py-3 text-sm tracking-[0.15em] transition hover:bg-white/10">设计模式</a>
          <a href="/blog/" className="rounded-full border border-white/20 px-6 py-3 text-sm tracking-[0.15em] transition hover:bg-white/10">工程文章</a>
          <a href="https://github.com/MouXiaoJun" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-3 text-sm tracking-[0.15em] transition hover:bg-white/10">GitHub</a>
        </div>
      </FadeIn>
    </footer>
  )
}

export default function App() {
  return (
    <main className="app overflow-x-clip bg-[#0C0C0C]">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <SiteFooter />
    </main>
  )
}
