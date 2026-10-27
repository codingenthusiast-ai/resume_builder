"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  LayoutDashboard,
  ScanLine,
  PenLine,
  ShieldCheck,
} from "lucide-react";
export function Header() {
  const path = usePathname();
  return (
    <header className="header">
      <Link href="/" className="brand">
        <span className="brand-icon">
          <FileText size={20} />
        </span>
        ResumeFit<span className="brand-ai">AI</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link
          className={path === "/dashboard" ? "active" : ""}
          href="/dashboard"
        >
          <LayoutDashboard size={16} />
          Workspace
        </Link>
        <Link className={path === "/analyze" ? "active" : ""} href="/analyze">
          <ScanLine size={16} />
          Analyze
        </Link>
        <Link className={path === "/builder" ? "active" : ""} href="/builder">
          <PenLine size={16} />
          Resume builder
        </Link>
      </nav>
      <span className="guest">Guest workspace</span>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} ResumeFit AI</span>
      <Link href="/privacy">
        <ShieldCheck size={14} /> Privacy & your data
      </Link>
      <span>
        Built for your next chapter <ArrowUpRight size={14} />
      </span>
    </footer>
  );
}
