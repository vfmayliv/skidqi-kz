import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { useAppStore } from '@/stores/useAppStore';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { mockListings } from '@/data/mockListings';
import { 
  PropertyType,
  BuildingType,
  ConditionType,
  SortOption,
  PropertyFilterConfig,
} from '@/types/listingType';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface DistrictData {
  id: string;
  name: {
    ru: string;
    kz: string;
  };
}

export const propertyFilterConfig: PropertyFilterConfig = {
  areaRangeMin: 10,
  areaRangeMax: 500,
  floorRangeMin: 1,
  floorRangeMax: 30,
  dealTypes: [
    { id: 'sale', label: { ru: 'Продажа', kz: 'Сату' } },
    { id: 'rent', label: { ru: 'Аренда', kz: 'Жалға алу' } }
  ],
  segments: [
    { 
      id: 'residential', 
      label: { ru: 'Жилая недвижимость', kz: 'Тұрғын үй' },
      types: []
    },
    { 
      id: 'commercial', 
      label: { ru: 'Коммерческая недвижимость', kz: 'Коммерциялық жылжымайтын мүлік' },
      types: []
    }
  ],
  residentialFilters: [],
  commercialFilters: [],
  generalFilters: []
};

export function PropertyPage() {
  const { language } = useAppStore();
  const { filters, setFilters, resetFilters, activeFiltersCount } = usePropertyFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredListings, setFilteredListings] = useState(
    mockListings.filter(listing => listing.propertyType)
  );
  const [districts, setDistricts] = useState<DistrictData[]>([]);

  useEffect(() => {
    const mockDistricts: DistrictData[] = [
      { id: 'almaty-district', name: { ru: 'Алмалинский район', kz: 'Алмалы ауданы' } },
      { id: 'bostandyk-district', name: { ru: 'Бостандыкский район', kz: 'Бостандық ауданы' } },
      { id: 'alatau-district', name: { ru: 'Алатауский район', kz: 'Алатау ауданы' } },
    ];
    setDistricts(mockDistricts);
  }, []);

  useEffect(() => {
    const initialPropertyType = searchParams.get('type') as PropertyType || null;
    if (initialPropertyType) {
      setFilters({ 
        propertyTypes: initialPropertyType ? [initialPropertyType] : null 
      });
    }
  }, [searchParams, setFilters]);

  useEffect(() => {
    let newListings = [...mockListings.filter(listing => listing.propertyType)];
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      newListings = newListings.filter(listing => listing.propertyType && filters.propertyTypes?.includes(listing.propertyType));
    }
    
    if (filters.priceRange.min) {
      newListings = newListings.filter(listing => listing.discountPrice >= filters.priceRange.min!);
    }
    if (filters.priceRange.max) {
      newListings = newListings.filter(listing => listing.discountPrice <= filters.priceRange.max!);
    }
    
    if (filters.areaRange.min) {
      newListings = newListings.filter(listing => listing.area && listing.area >= filters.areaRange.min!);
    }
    if (filters.areaRange.max) {
      newListings = newListings.filter(listing => listing.area && listing.area <= filters.areaRange.max!);
    }
    
    if (filters.floorRange.min) {
      newListings = newListings.filter(listing => listing.floor && listing.floor >= filters.floorRange.min!);
    }
    if (filters.floorRange.max) {
      newListings = newListings.filter(listing => listing.floor && listing.floor <= filters.floorRange.max!);
    }
    
    if (filters.buildingTypes) {
      newListings = newListings.filter(listing => listing.buildingType && filters.buildingTypes?.includes(listing.buildingType));
    }
    
    if (filters.renovationTypes) {
      newListings = newListings.filter(listing => listing.renovationType && filters.renovationTypes?.includes(listing.renovationType));
    }
    
    if (filters.bathroomTypes) {
      newListings = newListings.filter(listing => listing.bathroom && filters.bathroomTypes?.includes(listing.bathroom));
    }
    
    if (filters.districts && filters.districts.length > 0) {
      newListings = newListings.filter(listing => listing.districtId && filters.districts?.includes(listing.districtId));
    }
    
    // Фильтрация по административным единицам
    if (filters.regionId) {
      newListings = newListings.filter(listing => {
        return listing.regionId === filters.regionId;
      });
    }
    
    if (filters.cityId) {
      newListings = newListings.filter(listing => {
        return listing.cityId === filters.cityId;
      });
    }
    
    if (filters.microdistrictId) {
      newListings = newListings.filter(listing => {
        return listing.microdistrictId === filters.microdistrictId;
      });
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case SortOption.PRICE_ASC:
          newListings.sort((a, b) => a.discountPrice - b.discountPrice);
          break;
        case SortOption.PRICE_DESC:
          newListings.sort((a, b) => b.discountPrice - a.discountPrice);
          break;
        case SortOption.AREA_ASC:
          newListings.sort((a, b) => (a.area || 0) - (b.area || 0));
          break;
        case SortOption.AREA_DESC:
          newListings.sort((a, b) => (b.area || 0) - (a.area || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredListings(newListings);
  }, [filters]);

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.propertyTypes && newFilters.propertyTypes.length > 0) {
      params.set('type', newFilters.propertyTypes[0]);
    } else {
      params.delete('type');
    }
    
    setSearchParams(params);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateUrlParams({...filters, ...newFilters});
  };

  const handleReset = () => {
    resetFilters();
    setSearchParams({});
  };

  const handleSearch = () => {
    console.log('Search triggered with filters:', filters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onSearch={handleSearch}
            districts={districts}
            activeFiltersCount={activeFiltersCount}
            config={{
              dealTypes: [
                { id: 'sale', label: { ru: 'Продажа', kz: 'Сату' } },
                { id: 'rent', label: { ru: 'Аренда', kz: 'Жалға алу' } }
              ],
              segments: [
                { 
                  id: 'residential', 
                  label: { ru: 'Жилая недвижимость', kz: 'Тұрғын үй' },
                  types: []
                },
                { 
                  id: 'commercial', 
                  label: { ru: 'Коммерческая недвижимость', kz: 'Коммерциялық жылжымайтын мүлік' },
                  types: []
                }
              ],
              residentialFilters: [],
              commercialFilters: [],
              generalFilters: []
            }}
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {filteredListings.map(listing => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
