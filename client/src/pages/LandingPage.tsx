import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Bookmark, 
  Clock, 
  ArrowRight, 
  Play, 
  ChevronDown, 
  BrainCircuit, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { AiFillGithub  } from "react-icons/ai";
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleStart = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const faqs = [
    {
      q: "How does LearnTube extract information from YouTube?",
      a: "LearnTube automatically retrieves official and auto-generated video transcripts. Our pipeline splits and indexes these transcript segments with down-to-the-second timestamp markers, organizing the raw data for precise conceptual retrieval."
    },
    {
      q: "Can I click timestamps to jump directly to sections?",
      a: "Yes! Every single AI answer includes linked citation chips. Clicking on a citation highlights the exact paragraph of text in the source sidebar. In a future update, this will synchronize directly with active video timeline playback."
    },
    {
      q: "Does LearnTube support long-format academic lectures?",
      a: "Absolutely. LearnTube is optimized precisely for long textbooks, full university streams, and multi-hour tech deep dives where finding specific answers is normally tedious."
    },
    {
      q: "What types of YouTube videos work best?",
      a: "Any academic lecture, code walkthrough, scientific documentary, or informational podcast works exceptionally well. Videos with clear speech yield the highest-fidelity summaries."
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 overflow-x-hidden font-sans">
      <nav id="navbar" className="sticky top-0 z-50 bg-[#070A13]/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-1 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <img src="src/assets/logo.svg" className="w-10 h-10 bg-[#ffffff] rounded-xl p-2" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              LearnTube <span className="text-xs px-1.5 py-0.5 rounded-lg border border-[#565656] font-medium">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#cacaca] hover:text-white text-sm transition-colors">Features</a>
            <a href="#how-it-works" className="text-[#cacaca] hover:text-white text-sm transition-colors">How it Works</a>
            <a href="#faq" className="text-[#cacaca] hover:text-white text-sm transition-colors">FAQ</a>
            <span className="text-[#696969] hover:text-slate-500 text-sm cursor-not-allowed transition-colors">Pricing (Demo Free)</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#aeaeae] hover:text-white transition-colors"
              id="github-link"
            >
              <AiFillGithub className="w-5 h-5" />
            </a>
            {token ? (
              <button 
                id="btn-go-dash"
                onClick={() => navigate('/dashboard')} 
                className="bg-[#000000] border border-[#6e6e6e] hover:bg-[#151515] text-white text-sm px-4 py-2 rounded-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button 
                  id="btn-nav-login"
                  onClick={() => navigate('/login')} 
                  className="text-[#aeaeae] hover:text-slate-200 text-sm font-medium transition-colors"
                >
                  Login
                </button>
                <button 
                  id="btn-nav-start"
                  onClick={handleStart} 
                  className="bg-[#000000] border border-[#6e6e6e] hover:bg-[#151515] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/10"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-12 right-1/4 w-[300px] h-[300px] bg-blue-950/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              AI-Powered <br />
              <span className="text-[#ffffff]">
                YouTube Learning
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#b9b9b9] leading-relaxed max-w-xl"
            >
              Don't waste hours scrolling through bloated video intros. Drop any YouTube lecture link, instantly extract structured chapter maps, search transcripts, and chat with an AI synced directly to verified citation sources.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button 
                id="btn-hero-start"
                onClick={handleStart}
                className="bg-[#ffffff] hover:bg-[#d5d5d5] text-black font-medium px-6 py-3 rounded-xl flex items-center gap-2 group duration-200 transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
              >
                Get Started Free <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a 
                href="#how-it-works"
                className="bg-[#000000] border border-[#6e6e6e] hover:bg-[#151515] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current text-white" /> View Demo
              </a>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 h-[400px] w-full"
          >
            <div id="product-mockup" className="w-full h-full bg-black border border-[#2c2c2c] rounded-xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-sm">
              <div className="bg-slate-950/35 border-slate-900/80 px-4 py-3 border flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#686868]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#686868]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#686868]" />
                </div>
                <div className="text-[11px] border bg-[#1a1a1a] border-[#6e6e6e] text-[#dadada] px-3 py-0.5 rounded-md w-1/2 text-center truncate">
                  learnTube.ai/videos/vid-llm-1
                </div>
                <div className="w-6" />
              </div>

              <div className="flex-1 grid grid-cols-12 text-left">
                <div className="col-span-3 border-r border-slate-900/80 bg-slate-950/35 p-3 flex flex-col gap-2">
                  <div className="h-4 bg-[#333333] border border-indigo-500/15 rounded-md w-full" />
                  <div className="space-y-1.5 pt-2">
                    <div className="h-2.5 bg-[#363636] rounded w-11/12" />
                    <div className="h-2.5 bg-[#363636] rounded w-8/12" />
                    <div className="h-2.5 bg-[#252525] rounded w-10/12" />
                  </div>
                </div>

                <div className="col-span-9 p-4 flex flex-col gap-3 justify-between bg-black">
                  <div className="space-y-3">
                    <div className="space-y-1.5 max-w-[85%] bg-[#121212] border border-indigo-950/40 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 text-[10px] text-[#b9b9b9] font-mono">
                        <img src="src/assets/logo1.svg" className="w-3 h-3" /> LearnTube Assistant
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#aeaeae]">
                        Combine the strengths of people through positive teamwork, so as to achieve goals no one person could have done alone. Get the best performance out of a group of people through encouraging meaningful contribution, and modeling inspirational and supportive leadership.
                      </p>
                      <div className="inline-flex items-center gap-1 text-[9px] bg-[#121212] border-[#424242] rounded-lg px-1.5 py-0.5 text-[#c0c0c0] border cursor-pointer">
                        <Clock className="w-2.5 h-2.5" /> 03:14
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[70%] bg-[#121212] rounded-lg p-2.5 text-right text-[11px] text-[#aeaeae]">
                        How is standard attention calculated?
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/80 rounded px-2.5 py-1.5 flex items-center justify-between">
                    <div className="h-2.5 bg-[#252525]  rounded w-3/4" />
                    <div className="w-5 h-5 rounded-full bg-[#252525] flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section id="features" className="pt-5 pb-10 bg-slate-950/40 border-y border-slate-950 px-6 relative">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Power Features for Dynamic Learning
            </h2>
            <p className="text-[#aeaeae] text-sm sm:text-base">
              LearnTube transforms a passive video stream into an active text ecosystem, linking explanations with verifiable proof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl text-left space-y-3 shadow-sm hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-[#151515] border border-indigo-500/20 rounded-lg inline-block">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-lg">Instant Video Indexer</h3>
              <p className="text-[#aeaeae] text-sm leading-relaxed">
                Parse long recordings and compile structured topic sections automatically the moment you paste.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl text-left space-y-3 shadow-sm hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-[#151515] border border-indigo-500/20 rounded-lg inline-block ">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-lg">Context-Synced ChatGPT</h3>
              <p className="text-[#aeaeae] text-sm leading-relaxed">
                Chat with an AI companion trained directly on the lecture's spoken details, terminology, and slides data.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl text-left space-y-3 shadow-sm hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-[#151515] border border-indigo-500/20 rounded-lg inline-block ">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-lg">Inline Citation Mapping</h3>
              <p className="text-[#aeaeae] text-sm leading-relaxed">
                Every claim has an associated timestamp. Click the chip to jump right to the verified transcript paragraph.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-xl text-left space-y-3 shadow-sm hover:border-slate-800 transition-all">
              <div className="p-2.5 bg-[#151515] border border-indigo-500/20 rounded-lg inline-block ">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-lg">ChatGPT-Style Sidetrack</h3>
              <p className="text-[#aeaeae] text-sm leading-relaxed">
                Organize sub-discussions, code drafts, or summaries into individual chat histories, custom sorted and searchable.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white">How it Works</h2>
            <p className="text-[#aeaeae] text-sm">
              LearnTube transforms your study flow in three instantaneous steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto text-left">
            <div className="flex gap-4 relative">
              <span className="text-5xl font-extrabold text-[#b5b5b5] font-mono select-none">01</span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Paste YouTube Link</h3>
                <p className="text-[#aeaeae] text-sm leading-relaxed">
                  Simply paste any educational lecture or tech presentation. We begin transcript download immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <span className="text-5xl font-extrabold text-[#b5b5b5] font-mono select-none">02</span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">AI Structuring</h3>
                <p className="text-[#aeaeae] text-sm leading-relaxed">
                  Our service indices content, generates summary blueprints, and links topics directly to timeline timestamps.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <span className="text-5xl font-extrabold text-[#b5b5b5] font-mono select-none">03</span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Interactive Research</h3>
                <p className="text-[#aeaeae] text-sm leading-relaxed">
                  Ask details, compare theories, and access precise transcript citations instantly to clarify complex notions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950/20 border-t border-slate-900 px-6">
        <div className="max-w-5xl mx-auto bg-black p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-white">Why Learn with LearnTube?</h2>
            <p className="text-[#aeaeae] text-sm leading-relaxed">
              Standard video watching is inherently passive—leading to short-term retention. By introducing an interactive, citation-backed chat workspace, LearnTube transforms learning into an active study loop. Research shows active recall increases concept retention by up to 150%.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5 text-sm text-[#e9e9e9]">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Save dozens of hours of video scrub times</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-[#e9e9e9]">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Verify everything using actual citation clips</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-[#e9e9e9]">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Compile clean learning notes summaries effortlessly</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-inner w-full md:w-auto">
            <div className="text-4xl font-extrabold text-white">10x</div>
            <div className="text-xs  font-medium tracking-wider uppercase pt-1">Faster Retention</div>
            <div className="text-[10px] text-slate-500 pt-3">Backed by Active Recall Research</div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-[#aeaeae] text-xs">Got questions? We have answer vectors ready.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-900 bg-slate-900/10 rounded-xl overflow-hidden transition-all duration-200">
                <button 
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/35 transition-all"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className="font-semibold text-slate-200 hover:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4  cursor-help" /> {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#aeaeae] transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-5 pt-1 text-[#aeaeae] text-sm leading-relaxed border-t border-slate-900 bg-slate-950/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-24 px-6 border-t border-slate-900">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Simplify Your Lecture Learning?
          </h2>
          <p className="text-[#aeaeae] max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Join students, researchers, and professional developers accelerating their understanding with structural AI breakdowns.
          </p>
          <div>
            <button 
              id="btn-cta-start"
              onClick={handleStart}
              className="bg-white hover:bg-[#e0e0e0] text-black font-medium px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/15 group transition-all"
            >
              Start Chatting with Videos <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <footer id="footer" className= "border-t border-[#484848] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-sm text-[#8e8e8e]">
            &copy; 2026 LearnTube AI Inc. All rights reserved. Built for lightning-fast comprehension.
          </span>
          <div className="flex gap-6 text-sm text-[#8e8e8e] cursor-pointer">
            <span className="hover:text-[#aeaeae]">Privacy Policy</span>
            <span className="hover:text-[#aeaeae]">Terms of Service</span>
            <span className="hover:text-[#aeaeae] cursor-pointer" onClick={() => navigate('/login')}>Demo Login</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
