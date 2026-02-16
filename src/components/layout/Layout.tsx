import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import FlyToCart from '@/components/cart/FlyToCart';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
      <FlyToCart />
    </div>
  );
};

export default Layout;