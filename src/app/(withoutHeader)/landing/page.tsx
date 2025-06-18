'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Bot, MegaphoneIcon, Newspaper, Send } from 'lucide-react';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import choon from '@/assets/choon.png';
import { SafeImage } from '@/shared/ui/component/SafeImage';

function GlassCard({
  children,
  className = '',
  blur = 'backdrop-blur-xl',
}: {
  children: React.ReactNode;
  className?: string;
  blur?: string;
}) {
  return (
    <div
      className={`
      bg-white/10 ${blur} border border-white/20 
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      ${className}
    `}
    >
      {children}
    </div>
  );
}

function ChatMessage({ message, isUser, delay }: { message: string; isUser: boolean; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px 0px -100px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8`}
    >
      <div className="space-y-4 max-w-[90%]">
        <div className="flex items-start gap-1.5">
          {!isUser && (
            <div className="min-w-10 max-w-10 border-white/30">
              <SafeImage
                src={choon}
                alt="프로필 이미지"
                width={32}
                height={32}
                className="rounded-full object-cover border-gray-400 border-1"
              />
            </div>
          )}

          <div
            className={`
              relative px-4 py-3 rounded-3xl shadow-lg
              ${
                isUser
                  ? 'bg-slate-800/80 backdrop-blur-xl text-white rounded-tr-lg border border-slate-600/30'
                  : 'bg-white/80 backdrop-blur-xl text-gray-800 rounded-tl-lg border border-white/30'
              }
            `}
          >
            <p className="text-sm leading-relaxed font-medium whitespace-pre-line">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen max-w-app relative overflow-hidden">
      {/* 배경 */}
      <div className=" inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-purple-800 to-slate-700" />
      </div>

      <div className="relative z-10 container mx-auto px-8 py-16">
        <div className="flex flex-col space-y-32">
          {/* Hero */}
          <motion.div style={{ y: headerY }} className="flex flex-col space-y-12 min-h-screen justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center space-y-8"
            >
              <h1 className="text-6xl font-bold text-white leading-tight">
                <span className="block mb-4">카테부 정보는</span>
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  춘비서에게!
                </span>
              </h1>
              <p className="text-xl text-white leading-relaxed">
                카카오테크 부트캠프의 모든 정보와 일정, 공지사항을
                <span className="font-semibold text-emerald-300"> 스마트한 AI 챗봇</span>이 알려드립니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-6 items-center"
            >
              <motion.a href="/home" className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <GlassCard className="px-12 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-all duration-300">
                  <div className="flex items-center gap-3 text-black text-lg font-semibold">
                    <Send className="w-5 h-5" />
                    지금 바로 시작하기
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </GlassCard>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* 카테부 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 60 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-16"
          >
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-white">카카오테크 부트캠프란?</h2>
              <video autoPlay muted loop playsInline className="rounded-2xl">
                <source src="/videos/ktb.mp4" />
              </video>
              <p className="text-lg text-white mx-auto text-left space-y-2">
                카카오에서 좋은 개발자를 양성하고,
                <br />
                지속 가능한 개발 생태계를 만들기 위해
                <strong> 카카오테크 부트캠프</strong>를 새롭게 시작합니다.
                <br />
                <br />
                성장하고 싶은 예비 개발자가 모이는 곳,
                <br />
                <strong> 카카오테크 부트캠프</strong>에서 당신의 꿈을 펼쳐보세요.
              </p>
            </div>
          </motion.div>

          {/* 주요 기능 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 60 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-white">주요 기능들</h2>
              <p className="text-xl text-gray-200 leading-relaxed">
                학습에 집중할 수 있도록 도와주는 다양한
                <br />
                편의 기능들
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {[
                {
                  icon: Bot,
                  title: 'AI 춘비서',
                  desc: '프로젝트 일정, 중요한 공지사항을 놓치지 않도록 정보를 제공합니다.',
                  color: 'from-emerald-400/80 to-teal-500/80',
                },
                {
                  icon: MegaphoneIcon,
                  title: '공지사항',
                  desc: '여러 플랫폼에 흩어져 있는 공지사항을 모아볼 수 있습니다.',
                  color: 'from-purple-400/80 to-pink-500/80',
                },
                {
                  icon: Newspaper,
                  title: '카테부 뉴스',
                  desc: '카카오테크 부트캠프에서 일어나는 다양한 소식들을 뉴스 형식으로 요약해드립니다.',
                  color: 'from-cyan-400/80 to-blue-500/80',
                },
                {
                  icon: BookOpen,
                  title: '위키',
                  desc: '카테부의 인물, 사건, 프로젝트를 정리한 위키입니다.',
                  color: 'from-orange-400/80 to-red-500/80',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
                  className="group"
                >
                  <GlassCard className="p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 h-full">
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <p className="text-gray-200 leading-relaxed">{feature.desc}</p>
                    </div>

                    {/* Glass reflection */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 춘비서 미리보기 */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ duration: 1, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center space-y-6"
            >
              <h2 className="text-4xl font-bold text-white">서비스 미리 보기</h2>
              <p className="text-xl text-gray-200">AI 춘비서와의 실제 대화를 확인해보세요.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <GlassCard className="rounded-3xl overflow-hidden border-white/30">
                <div className="p-4 space-y-6 bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-xl">
                  <ChatMessage message="안녕하세요! 휴가 신청은 어떻게 하나요?" isUser={true} delay={0} />

                  <ChatMessage
                    message={`안녕하세요! 🌿
휴가 신청 방법에 대해 안내드립니다.
...

🙏 휴가일 기준 평일 3일 전까지 신청해 주시기 바랍니다.`}
                    isUser={false}
                    delay={0.8}
                  />

                  <ChatMessage message="유료 구독료 지원 일정을 알려줘!" isUser={true} delay={1.6} />

                  <ChatMessage
                    message={`안녕하세요! 🌿
유료 구독료 지원 일정에 대해 안내드립니다.
...

🙏 구체적인 환급 일정은 추후 안내드릴 예정이니, 구글폼 제출 후 기다려 주시기 바랍니다.
                    `}
                    isUser={false}
                    delay={2.4}
                  />
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* 푸터 */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 60 }}
            transition={{ duration: 1, delay: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center space-y-12 py-16"
          >
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">지금 바로 시작해보세요</h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                카테부 생활의 든든한 파트너, AI 춘비서와 함께 더 스마트한 학습 여정을 시작하세요.
              </p>
            </div>

            <div className="flex flex-col gap-6 items-center">
              <motion.a href="/home" className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <GlassCard className="px-12 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 transition-all duration-300">
                  <div className="flex items-center gap-3 text-black text-xl font-semibold">
                    <Send className="w-6 h-6" />
                    서비스 이용하러 가기
                  </div>
                </GlassCard>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
