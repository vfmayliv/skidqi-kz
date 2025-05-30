
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import { CategoryPage } from '@/pages/CategoryPage';
import SubcategoryPage from '@/pages/SubcategoryPage';
import ListingDetail from '@/pages/ListingDetail';
import SearchResults from '@/pages/SearchResults';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import UserProfile from '@/pages/UserProfile';
import CreateListing from '@/pages/CreateListing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Help from '@/pages/Help';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import NotFound from '@/pages/NotFound';
import OwnerPanel from '@/pages/OwnerPanel';
import ConfirmEmail from '@/pages/ConfirmEmail';
import { AuthProtection } from '@/components/AuthProtection';
import { PropertyPage } from '@/pages/PropertyPage';
import { TransportPage } from '@/pages/TransportPage';
import ElectronicsPage from '@/pages/ElectronicsPage';
import FashionPage from '@/pages/FashionPage';
import PetsPage from '@/pages/PetsPage';
import { AppProvider } from '@/contexts/AppContext';
import { SearchProvider } from '@/contexts/SearchContext';

// Import category configurations to ensure they are registered
import '@/categories/real-estate/config';
import '@/categories/transport/config';

const App: React.FC = () => {
  return (
    <AppProvider>
      <SearchProvider>
        <React.Fragment>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            
            {/* Category routes - Universal CategoryPage for all categories */}
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/category/:categoryId/:subcategoryId" element={<SubcategoryPage />} />
            
            {/* Support nested subcategories */}
            <Route path="/category/:categoryId/:subcategoryId/*" element={<SubcategoryPage />} />
            
            {/* Custom pages for specific categories */}
            <Route path="/property" element={<PropertyPage />} />
            <Route path="/transport" element={<TransportPage />} />
            
            {/* Listing detail routes - support various category path depths */}
            <Route path="/category/:categoryId/listing/:listingId" element={<ListingDetail />} />
            <Route path="/category/:categoryId/:subcategoryId/listing/:listingId" element={<ListingDetail />} />
            <Route path="/category/:categoryId/:subcategory1/:subcategory2/listing/:listingId" element={<ListingDetail />} />
            <Route path="/category/:categoryId/:subcategory1/:subcategory2/:subcategory3/listing/:listingId" element={<ListingDetail />} />
            <Route path="/category/:categoryId/:subcategory1/:subcategory2/:subcategory3/:subcategory4/listing/:listingId" element={<ListingDetail />} />
            
            {/* Catch-all route for deep subcategories */}
            <Route path="/category/:categoryId/**/listing/:listingId" element={<ListingDetail />} />
            
            {/* Categories with custom pages */}
            <Route path="/property" element={<PropertyPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/electronics" element={<ElectronicsPage />} />
            <Route path="/fashion" element={<FashionPage />} />
            <Route path="/pets" element={<PetsPage />} />
            
            {/* Transport and property specific listing routes */}
            <Route path="/transport/listing/:listingId" element={<ListingDetail />} />
            <Route path="/property/listing/:listingId" element={<ListingDetail />} />
            
            {/* Legacy listing route */}
            <Route path="/listing/:listingId" element={<ListingDetail />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/profile" element={
              <AuthProtection>
                <UserProfile />
              </AuthProtection>
            } />
            <Route path="/create-listing" element={
              <AuthProtection>
                <CreateListing />
              </AuthProtection>
            } />
            
            {/* Info pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Owner panel routes */}
            <Route path="/owner" element={<OwnerPanel />} />
            <Route path="/ownerpanel" element={<OwnerPanel />} />
            
            {/* Redirect old routes to new structure */}
            <Route path="/categories" element={<Navigate to="/" replace />} />
            <Route path="/category" element={<Navigate to="/" replace />} />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </React.Fragment>
      </SearchProvider>
    </AppProvider>
  );
};

export default App;
