import React from 'react';
import { Link } from 'react-router-dom';

const PageFooter: React.FC = () => {
  console.log('PageFooter loaded');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-6 px-4 md:px-6 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} FinDash. All rights reserved.</p>
          <nav className="flex gap-4 md:gap-6">
            <Link to="/#privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/#terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/#contact" className="hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;