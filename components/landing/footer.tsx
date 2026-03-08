"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { AetherLogo } from "@/components/ui/aether-logo";

const FOOTER_LINKS = [
  { label: "Product", links: [{ name: "Features", href: "#" }, { name: "Pricing", href: "#pricing" }, { name: "Changelog", href: "#" }, { name: "Status", href: "#" }] },
  { label: "Company", links: [{ name: "About", href: "#" }, { name: "Blog", href: "#" }, { name: "Careers", href: "#" }, { name: "Contact", href: "#" }] },
  { label: "Resources", links: [{ name: "Docs", href: "#" }, { name: "API", href: "#" }, { name: "Support", href: "#" }, { name: "Privacy", href: "#" }] },
];

const SOCIAL = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center text-white hover:opacity-90 transition-opacity" aria-label="Aether home">
              <AetherLogo className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-white/50 mt-2 mb-4 max-w-[200px]">
              AI operating layer for your work.
            </p>
            <div className="flex gap-4">
              {SOCIAL.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
          {FOOTER_LINKS.map((col) => (
            <div key={col.label}>
              <h4 className="text-sm font-semibold text-white/90 mb-4">
                {col.label}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white/80 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Aether. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="#" className="hover:text-white/70 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white/70 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
