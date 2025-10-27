import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Landing page for JointCode.
 * Replicates the hero section shown in the Figma mock‑up:
 *   • Logo + nav (Log in / Sign up) in the header
 *   • Gradient background
 *   • Centered headline, sub‑headline and CTA button
 */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1a3d] via-[#091e42] to-[#072456] text-white">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold select-none">
          <Code className="w-7 h-7" />
          JOINTCODE
        </Link>

        <nav className="flex items-center gap-4 text-lg">
          <Link to="/login" className="hover:underline">
            Log in
          </Link>

          {/* outlined “Sign up” button */}
          <Button
            asChild
            variant="ghost"
            className="border border-white text-white hover:bg-white/10 backdrop-blur-lg"
          >
            <Link to="/signup">Sign up</Link>
          </Button>
        </nav>
      </header>

      {/* ── Hero / Main content ─────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl"
        >
          Collaborative coding
          <br className="hidden md:block" />
          made easy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xl md:text-2xl mt-6 max-w-xl text-white/80"
        >
          Code together in real‑time with your team, seamlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10"
        >
          <Button size="lg" className="
                              px-10 py-6 text-xl 
                              bg-blue-400       /* primary blue */
                              hover:bg-blue-500 /* darker on hover */" asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;