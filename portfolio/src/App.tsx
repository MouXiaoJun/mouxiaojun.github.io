import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, BookOpen, Github } from 'lucide-react'

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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

type ActionLinkProps = {
  href: string
  children: ReactNode
  icon?: ReactNode
  external?: boolean
  variant?: 'primary' | 'outline' | 'ghost'
}

function ActionLink({ href, children, icon, external = false, variant = 'outline' }: ActionLinkProps) {
  const className =
    variant === 'primary'
      ? 'primary-action'
      : variant === 'ghost'
        ? 'ghost-action'
        : 'outline-action'

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`${className} inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-[0.1em] transition sm:px-8`}
    >
      {children}
      {icon ?? <ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
    </a>
  )
}

function Magnet({ children, padding = 150, strength = 3 }: { children: ReactNode; padding?: number; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !canHover || reduceMotion) return

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
  const repeated = [...items, ...items]

  useEffect(() => {
    const node = row.current
    const section = node?.closest('section')
    if (!node || !section) return

    let frame = 0
    let sectionTop = 0

    const render = () => {
      frame = 0
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.26
      const x = direction === 'right' ? offset - 260 : -(offset - 260)
      node.style.transform = `translate3d(${x}px, 0, 0)`
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(render)
    }

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY
      schedule()
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
    }
  }, [direction])

  return (
    <div ref={row} className="flex w-max gap-3" style={{ willChange: 'transform' }}>
      {repeated.map(([title, subtitle], index) => (
        <article
          key={`${title}-${index}`}
          className="tech-tile flex h-[200px] w-[310px] shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-[#111318] p-6 sm:h-[270px] sm:w-[420px] sm:p-7"
          aria-hidden={index >= items.length}
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
    <section className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="技术能力">
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
    <p ref={ref} className="mx-auto max-w-[720px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]">
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
    <section className="relative flex h-screen min-h-[680px] flex-col overflow-x-clip bg-[#0C0C0C]">
      <FadeIn delay={0} y={-20} className="relative z-40">
        <nav className="flex justify-between px-6 pt-6 text-sm font-medium tracking-wider text-[#D7E2EA] sm:px-8 md:px-10 md:pt-8 md:text-lg lg:text-[1.35rem]" aria-label="主导航">
          <a className="nav-link" href="#about">关于</a>
          <a className="nav-link" href="#services">方向</a>
          <a className="nav-link" href="#projects">项目</a>
          <a className="nav-link" href="#writing">文章</a>
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

      <div className="relative z-30 mt-auto grid items-end gap-6 px-6 pb-7 sm:px-8 sm:pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs tracking-[0.2em] text-[#40C8E8]">
              <span className="h-2 w-2 rounded-full bg-[#40C8E8] shadow-[0_0_16px_rgba(64,200,232,0.8)]" />
              GO 后端 · AI 平台 · 开源工程
            </p>
            <p className="max-w-[560px] text-[clamp(0.92rem,1.35vw,1.35rem)] font-light leading-relaxed tracking-wide text-[#D7E2EA]">
              把真实业务里反复出现的问题，做成可靠、清晰、可复用的系统与开发者工具。
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="flex flex-wrap gap-3 md:justify-end">
          <ActionLink href="#projects" variant="primary">查看开源项目</ActionLink>
          <ActionLink href="https://github.com/MouXiaoJun" external icon={<Github className="h-4 w-4" />}>GitHub</ActionLink>
        </FadeIn>
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
    <section id="about" className="content-auto relative flex min-h-screen scroll-mt-8 items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10">
      {decorations.map((item) => (
        <FadeIn key={item.label} delay={item.delay} x={item.x} y={0} duration={0.9} className={`pointer-events-none absolute ${item.className}`}>
          <div className="flex aspect-square w-full items-center justify-center rounded-[32%] border border-white/10 bg-gradient-to-br from-[#16191f] to-[#0e1014] text-[clamp(2rem,5vw,4.2rem)] font-black tracking-tight text-[#73808B] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            {item.label}
          </div>
        </FadeIn>
      ))}

      <div className="relative z-10 flex w-full flex-col items-center">
        <FadeIn delay={0} y={40}>
          <p className="mb-5 text-center text-xs tracking-[0.22em] text-[#40C8E8]">01 / 关于</p>
          <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black leading-none tracking-tight">关于我</h2>
        </FadeIn>
        <div className="mt-10 sm:mt-14 md:mt-16"><AnimatedText text={text} /></div>
        <FadeIn delay={0.2} y={24} className="mt-16 flex flex-wrap justify-center gap-3 sm:mt-20 md:mt-24">
          <ActionLink href="/about/" variant="primary">完整经历</ActionLink>
          <ActionLink href="/blog/" icon={<BookOpen className="h-4 w-4" />}>阅读文章</ActionLink>
        </FadeIn>
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
    <section id="services" className="content-auto scroll-mt-8 rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn>
        <p className="mb-5 text-center text-xs tracking-[0.22em] text-[#087F9C]">02 / 能力边界</p>
        <h2 className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black leading-none tracking-tight sm:mb-20 md:mb-28">专注方向</h2>
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        {services.map(([number, name, description], index) => (
          <FadeIn key={name} delay={index * 0.08} y={30}>
            <article className="grid grid-cols-[minmax(72px,0.42fr)_1.58fr] gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 last:border-b sm:grid-cols-[minmax(110px,0.65fr)_1.35fr] sm:gap-10 sm:py-10 md:py-12">
              <div className="text-[clamp(2.6rem,10vw,140px)] font-black leading-none tracking-tight">{number}</div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[clamp(1.1rem,2.2vw,2.1rem)] font-semibold tracking-tight">{name}</h3>
                <p className="mt-4 max-w-2xl text-[clamp(0.9rem,1.6vw,1.25rem)] font-light leading-relaxed opacity-60">{description}</p>
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
  status: string
  evidence: string
  summary: string
  detailHref: string
  githubHref: string
  highlights: [string, string, string]
}

const projects: Project[] = [
  {
    number: '01',
    title: '分布式同步工具箱',
    repo: 'distsync',
    category: '分布式系统',
    status: '持续维护',
    evidence: 'Redis / Valkey · Go 1.21+',
    summary: '面向 Go 服务的 sync 风格分布式同步原语，统一处理租约、自动续期、Fencing Token、Redis Cluster 与可观测性。',
    detailHref: '/projects/distsync/',
    githubHref: 'https://github.com/MouXiaoJun/distsync',
    highlights: ['互斥锁 · 读写锁 · 信号量', '四种限流算法 · 主节点选举', '租约 · Fencing Token · Redis / Valkey'],
  },
  {
    number: '02',
    title: '模块化单体架构工具',
    repo: 'gomodulith',
    category: '架构治理',
    status: '持续构建',
    evidence: 'go/packages · CLI · CI',
    summary: '围绕 Go 的包模型和 internal 规则，把模块发现、边界验证、循环依赖检测与架构文档变成可执行工具。',
    detailHref: '/projects/gomodulith/',
    githubHref: 'https://github.com/MouXiaoJun/gomodulith',
    highlights: ['模块自动发现', '边界验证 · 循环依赖检测', '架构图 · AI 可读架构契约'],
  },
  {
    number: '03',
    title: '有状态 API 模糊测试',
    repo: 'specriot',
    category: 'API 正确性',
    status: 'v0.2 已实现',
    evidence: 'OpenAPI 3 · Contract Fuzzing',
    summary: '从 OpenAPI 生成确定性请求与边界输入，验证响应契约，并逐步演进到依赖关系推断、有状态序列和失败缩减。',
    detailHref: '/projects/specriot/',
    githubHref: 'https://github.com/MouXiaoJun/specriot',
    highlights: ['OpenAPI 请求与约束生成', '契约验证 · 边界与非法输入', '确定性 Seed · Stateful Roadmap'],
  },
]

function ProjectVisual({ text, large = false }: { text: string; large?: boolean }) {
  return (
    <div className={`project-visual flex w-full flex-col justify-between rounded-[32px] border border-white/10 bg-[#111318] p-5 sm:rounded-[44px] sm:p-6 md:rounded-[60px] ${large ? 'h-full min-h-[280px] lg:min-h-[360px]' : 'h-full'}`}>
      <span className="text-xs font-medium tracking-[0.18em] text-[#6F7B86]">工程能力</span>
      <strong className="max-w-[18ch] text-[clamp(1.2rem,2.8vw,3rem)] font-black leading-[0.98] tracking-tight text-[#D7E2EA]">{text}</strong>
      <span className="text-xs tracking-[0.16em] text-[#596570]">MouXiaoJun / 开源项目</span>
    </div>
  )
}

function ProjectCard({ project, index, total, stacked }: { project: Project; index: number; total: number; stacked: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'start start'] })
  const targetScale = 1 - (total - 1 - index) * 0.025
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  const isLast = index === total - 1

  return (
    <div ref={container} className={stacked ? `relative ${isLast ? 'h-[116vh]' : 'h-[96vh]'}` : 'relative mb-8'}>
      <motion.article
        className={`${stacked ? 'sticky' : 'relative'} rounded-[32px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 text-[#D7E2EA] sm:rounded-[44px] sm:p-6 md:rounded-[60px] md:p-8`}
        style={stacked ? { scale, top: `calc(5.5rem + ${index * 28}px)` } : undefined}
      >
        <div className="grid gap-5 pb-6 lg:grid-cols-[0.28fr_0.62fr_1.3fr_auto] lg:items-end lg:gap-6 md:pb-8">
          <div className="hero-heading text-[clamp(3rem,8vw,110px)] font-black leading-none">{project.number}</div>
          <div>
            <div className="text-sm font-light tracking-[0.12em] opacity-60">开源 · {project.category}</div>
            <div className="mt-2 font-mono text-xs tracking-[0.16em] text-[#66727D]">{project.repo}</div>
          </div>
          <div>
            <h3 className="text-[clamp(1.7rem,3vw,3.2rem)] font-semibold leading-none tracking-tight">{project.title}</h3>
            <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-[#8997A3] sm:text-base">{project.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs tracking-[0.08em]">
              <span className="rounded-full border border-[#40C8E8]/35 bg-[#40C8E8]/10 px-3 py-1.5 text-[#7DDFF3]">{project.status}</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-[#7E8B96]">{project.evidence}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <ActionLink href={project.detailHref} variant="primary">项目详情</ActionLink>
            <ActionLink href={project.githubHref} external icon={<Github className="h-4 w-4" />}>源码</ActionLink>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[0.4fr_0.6fr]">
          <div className="grid gap-3 sm:gap-4">
            <div className="min-h-[180px] lg:h-[clamp(170px,16vw,230px)]"><ProjectVisual text={project.highlights[0]} /></div>
            <div className="min-h-[210px] lg:h-[clamp(210px,22vw,340px)]"><ProjectVisual text={project.highlights[1]} /></div>
          </div>
          <ProjectVisual text={project.highlights[2]} large />
        </div>
      </motion.article>
    </div>
  )
}

function ProjectsSection() {
  const stacked = useMediaQuery('(min-width: 1024px) and (min-height: 820px)')

  return (
    <section id="projects" className="relative z-10 -mt-10 scroll-mt-8 rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32">
      <FadeIn>
        <p className="mb-5 text-center text-xs tracking-[0.22em] text-[#40C8E8]">03 / 可验证的工程作品</p>
        <h2 className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black leading-none tracking-tight sm:mb-20 md:mb-28">开源项目</h2>
      </FadeIn>
      <div className="mx-auto max-w-7xl">
        {projects.map((project, index) => (
          <ProjectCard key={project.repo} project={project} index={index} total={projects.length} stacked={stacked} />
        ))}
      </div>
      {stacked ? <div aria-hidden="true" className="h-[22vh]" /> : <div className="h-12" />}
    </section>
  )
}

const writings = [
  {
    eyebrow: '系列 / 23 篇',
    title: 'Go 设计模式 23 讲',
    summary: '不背 UML，从 Go 的接口、函数、组合、channel 和标准库重新理解模式的工程价值。',
    href: '/design-patterns/',
    meta: '创建型 · 结构型 · 行为型',
  },
  {
    eyebrow: 'Go / Backend',
    title: 'Context 不是参数搬运工',
    summary: '取消传播、超时预算和 goroutine 生命周期，为什么客户端断开后任务还在继续。',
    href: '/blog/go-context-cancellation',
    meta: 'Context · Cancellation · Timeout',
  },
  {
    eyebrow: 'Distributed Systems',
    title: '分布式锁为什么还需要 Fencing Token',
    summary: '自动续租无法消灭 lease-expiry race，最终写入仍然需要拒绝过期持有者。',
    href: '/blog/distributed-lock-fencing',
    meta: 'Lease · Fencing · Correctness',
  },
  {
    eyebrow: 'API Correctness',
    title: '为什么 API Fuzzing 必须理解状态',
    summary: '真正棘手的错误往往隐藏在 Create → Delete → Delete 这样的请求序列中。',
    href: '/blog/openapi-stateful-fuzzing',
    meta: 'OpenAPI · Stateful · Replay',
  },
]

function WritingSection() {
  return (
    <section id="writing" className="content-auto relative z-20 -mt-8 scroll-mt-8 rounded-t-[40px] bg-white px-5 py-20 text-[#0C0C0C] sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn>
        <p className="mb-5 text-center text-xs tracking-[0.22em] text-[#087F9C]">04 / 持续写下来的判断</p>
        <h2 className="mb-8 text-center text-[clamp(3rem,10vw,140px)] font-black leading-none tracking-tight">工程文章</h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-base font-light leading-relaxed text-black/55 sm:mb-20">
          文章优先解释设计背后的约束、失败路径和取舍，而不只贴一段“能运行”的代码。
        </p>
      </FadeIn>

      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
        {writings.map((item, index) => (
          <FadeIn key={item.title} delay={index * 0.07} y={24}>
            <a href={item.href} className="writing-card group flex min-h-[320px] flex-col rounded-[30px] border border-black/10 bg-[#F4F7F8] p-7 text-inherit transition sm:rounded-[40px] sm:p-9">
              <div className="flex items-center justify-between gap-4 text-xs tracking-[0.16em] text-black/45">
                <span>{item.eyebrow}</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h3 className="mt-12 max-w-[16ch] text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[0.98] tracking-tight">{item.title}</h3>
              <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-black/55">{item.summary}</p>
              <div className="mt-auto border-t border-black/10 pt-6 font-mono text-xs tracking-[0.1em] text-[#087F9C]">{item.meta}</div>
            </a>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="mt-12 flex justify-center" y={18}>
        <ActionLink href="/blog/" variant="ghost" icon={<BookOpen className="h-4 w-4" />}>查看全部工程文章</ActionLink>
      </FadeIn>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="relative z-30 bg-[#0C0C0C] px-5 pb-12 pt-14 text-[#D7E2EA] sm:px-8 md:px-10">
      <FadeIn y={18} className="mx-auto grid max-w-7xl gap-10 border-t border-white/10 pt-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs tracking-[0.22em] text-[#66727D]">MOUXIAOJUN / GO BACKEND / OPEN SOURCE</p>
          <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-[#8997A3]">
            持续构建 Go 基础设施、架构工具和 AI 工程能力，也持续把真实项目里的问题、取舍与答案写下来。
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <ActionLink href="/design-patterns/">设计模式</ActionLink>
          <ActionLink href="/blog/">工程文章</ActionLink>
          <ActionLink href="https://github.com/MouXiaoJun" external icon={<Github className="h-4 w-4" />}>GitHub</ActionLink>
        </div>
      </FadeIn>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-4 text-xs tracking-[0.12em] text-[#596570]">
        <span>© 2026 邓晖</span>
        <span>Go Backend · Distributed Systems · AI Platform</span>
      </div>
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
      <WritingSection />
      <SiteFooter />
    </main>
  )
}
