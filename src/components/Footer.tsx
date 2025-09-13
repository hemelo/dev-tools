import { Button } from "@/components/ui/button";
import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="text-2xl font-bold">DevTools Hub</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              The ultimate collection of developer tools for modern web development. 
              Built with ❤️ by developers who understand your needs.
            </p>
            <div className="flex gap-4 flex-wrap" role="group" aria-label="Social media links">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                onClick={() => window.open('https://github.com/hemelo/dev-tools', '_blank')}
                aria-label="GitHub - View project on GitHub (opens in new tab)"
              >
                <Github className="h-4 w-4 mr-2" aria-hidden="true" />
                GitHub
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                onClick={() => window.open('https://x.com/hemelodev', '_blank')}
                aria-label="Twitter - Follow on Twitter (opens in new tab)"
              >
                <Twitter className="h-4 w-4 mr-2" aria-hidden="true" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                onClick={() => window.open('https://www.linkedin.com/in/henriquefcmelo/', '_blank')}
                aria-label="LinkedIn - Connect on LinkedIn (opens in new tab)"
              >
                <Linkedin className="h-4 w-4 mr-2" aria-hidden="true" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-200"
                onClick={() => window.open('mailto:hemelo@pm.me', '_blank')}
                aria-label="Email - Send email (opens in new tab)"
              >
                <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                Email
              </Button>
            </div>
          </div>

          <nav aria-labelledby="tools-heading-footer">
            <h4 id="tools-heading-footer" className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors" aria-label="JSON Tools - View JSON tools">JSON Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" aria-label="Cryptography - View cryptography tools">Cryptography</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" aria-label="Web Development - View web development tools">Web Development</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" aria-label="Data Analysis - View data analysis tools">Data Analysis</a></li>
            </ul>
          </nav>

          <nav aria-labelledby="developer-heading-footer">
            <h4 id="developer-heading-footer" className="font-semibold mb-4">Developer</h4>
            <div className="space-y-3 text-sm text-muted-foreground" role="list">
              <div className="flex items-center gap-2" role="listitem">
                <Github className="h-4 w-4" aria-hidden="true" />
                <a 
                  href="https://github.com/hemelo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                  aria-label="GitHub Profile - View GitHub profile (opens in new tab)"
                >
                  GitHub Profile
                </a>
              </div>
              <div className="flex items-center gap-2" role="listitem">
                <Twitter className="h-4 w-4" aria-hidden="true" />
                <a 
                  href="https://x.com/hemelodev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                  aria-label="Twitter Profile - View Twitter profile (opens in new tab)"
                >
                  Twitter Profile
                </a>
              </div>
              <div className="flex items-center gap-2" role="listitem">
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                <a 
                  href="https://www.linkedin.com/in/henriquefcmelo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                  aria-label="LinkedIn Profile - View LinkedIn profile (opens in new tab)"
                >
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex items-center gap-2" role="listitem">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a 
                  href="mailto:henrique@hemelo.fyi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                  aria-label="hemelo@pm.me - Send email (opens in new tab)"
                >
                  hemelo@pm.me
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 DevTools Hub by <a href="https://github.com/hemelo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" aria-label="View @hemelo's GitHub profile (opens in new tab)">@hemelo</a>. Built with React, TypeScript, and Tailwind CSS. Open source and free forever.</p>
        </div>
      </div>
    </footer>
  );
};
