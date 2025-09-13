// React is automatically injected by esbuild
import CategoryPageComponent from '../components/pages/CategoryPage';

export default function CategoryPage({ slug }) {
  // Map slug to categoryName expected by the component
  const categoryName = decodeURIComponent(slug || '');

  const navigateBack = () => {
    window.location.href = '/categories';
  };

  return (
    <CategoryPageComponent categoryName={categoryName} onNavigateBack={navigateBack} />
  );
}
