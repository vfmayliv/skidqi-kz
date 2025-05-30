
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { useAppWithTranslations } from '@/stores/useAppStore'; 
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useChildrenCategories } from '@/hooks/useChildrenCategories';
import { usePharmacyCategories } from '@/hooks/usePharmacyCategories';

export function CategoryMenu() {
  const { language, t } = useAppWithTranslations();
  const { categories: childrenCategories, loading: childrenLoading } = useChildrenCategories();
  const { categories: pharmacyCategories, loading: pharmacyLoading } = usePharmacyCategories();

  // Helper function to dynamically render icons from Lucide
  const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    // Type assertion with a more specific type and a safety check
    const IconComponent = (LucideIcons as any)[name];
    
    // Return the icon if found, otherwise return null
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  // Get subcategories for a specific category (only first level)
  const getSubcategories = (categoryId: string) => {
    if (categoryId === 'kids') {
      return childrenCategories
        .filter(cat => cat.level === 1) // Only first level
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Baby'
        }));
    }
    if (categoryId === 'pharmacy') {
      return pharmacyCategories
        .filter(cat => cat.level === 1) // Only first level
        .map(cat => ({
          id: cat.slug,
          name: { ru: cat.name_ru, kz: cat.name_kz },
          icon: 'Pill'
        }));
    }
    return [];
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-lg font-medium mb-4">{t('categories')}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          // Special handling for property and transport categories
          if (category.id === 'property') {
            return (
              <Link
                key={category.id}
                to="/property"
                className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
                <span className="text-sm text-center">{category.name[language]}</span>
              </Link>
            );
          } else if (category.id === 'transport') {
            return (
              <Link
                key={category.id}
                to="/transport"
                className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
                <span className="text-sm text-center">{category.name[language]}</span>
              </Link>
            );
          }
          
          // For categories with subcategories (including kids and pharmacy from Supabase)
          const hasSubcategories = (category.subcategories && category.subcategories.length > 0) || 
                                  category.id === 'kids' || 
                                  category.id === 'pharmacy';
          
          if (hasSubcategories) {
            const subcategories = category.id === 'kids' || category.id === 'pharmacy' 
              ? getSubcategories(category.id)
              : category.subcategories || [];

            return (
              <Popover key={category.id}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center p-4 h-auto w-full hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
                    <span className="text-sm text-center">{category.name[language]}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Добавляем ссылку на саму категорию */}
                    <Link
                      to={`/category/${category.id}`}
                      className="flex items-center p-2 rounded-md hover:bg-accent font-medium"
                    >
                      <DynamicIcon name={category.icon} className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {language === 'ru' ? 'Все в категории' : 'Барлық санатта'} {category.name[language]}
                      </span>
                    </Link>
                    
                    {(category.id === 'kids' && childrenLoading) || (category.id === 'pharmacy' && pharmacyLoading) ? (
                      <div className="p-2 text-sm text-gray-500">Загрузка...</div>
                    ) : (
                      subcategories.map((subcat) => (
                        <Link
                          key={subcat.id}
                          to={`/category/${category.id}/${subcat.id}`}
                          className="flex items-center p-2 rounded-md hover:bg-accent"
                        >
                          <DynamicIcon name={subcat.icon} className="h-4 w-4 mr-2" />
                          <span className="text-sm">{subcat.name[language]}</span>
                        </Link>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
          
          // Default handling for categories without subcategories
          return (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
              <span className="text-sm text-center">{category.name[language]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
