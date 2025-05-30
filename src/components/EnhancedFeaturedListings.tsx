
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/ListingCard';
import { mockListings } from '@/data/mockListings';
import { useAppWithTranslations } from '@/stores/useAppStore';

export function EnhancedFeaturedListings() {
  const { t, language } = useAppWithTranslations();
  const [activeTab, setActiveTab] = useState<string>('featured');
  
  const featuredListings = mockListings.filter(listing => listing.isFeatured);
  const latestListings = [...mockListings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Center the heading and position it above the tabs */}
      <h2 className="text-2xl font-bold mb-4 text-center">{t('listings')}</h2>
      
      <Tabs defaultValue="featured" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="featured">
              <span className="hidden md:inline">{t('featuredAds')}</span>
              <span className="md:hidden">{language === 'ru' ? 'Избранные' : 'Таңдаулы'}</span>
            </TabsTrigger>
            <TabsTrigger value="latest">
              <span className="hidden md:inline">{t('latestAds')}</span>
              <span className="md:hidden">{language === 'ru' ? 'Новые' : 'Жаңа'}</span>
            </TabsTrigger>
          </TabsList>
          
          <Button variant="link" asChild>
            <Link to="/search">
              <span className="hidden md:inline">{t('allAds')}</span>
              <span className="md:hidden">{language === 'ru' ? 'Все' : 'Барлық'}</span>
            </Link>
          </Button>
        </div>
        
        <TabsContent value="featured" className="mt-0">
          {/* Always show 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredListings.slice(0, 8).map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="latest" className="mt-0">
          {/* Always show 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
