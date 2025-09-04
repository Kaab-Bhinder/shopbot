import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import CategorySelection from '../components/CategorySelection';
import TryOnFeature from '../components/TryOnFeature';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Banner />
      <FeaturedProducts />
      <CategorySelection />
      <TryOnFeature />
    </div>
  );
}
