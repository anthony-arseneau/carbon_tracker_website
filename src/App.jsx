import AbsorptionAlternatives from './components/AbsorptionAlternatives';
import ActionButtons from './components/ActionButtons';
import AirQuality from './components/AirQuality';
import BiosphereDegradation from './components/BiosphereDegradation';
import CarbonBudget from './components/CarbonBudget';
import EconomicCost from './components/EconomicCost';
import EmissionEquivalents from './components/EmissionEquivalents';
import Footer from './components/Footer';
import GlobalEmissionMap from './components/GlobalEmissionMap';
import Header from './components/Header';
import HumanImpact from './components/HumanImpact';
import MainCounter from './components/MainCounterV2';
import ShareButtons from './components/ShareButtons';
import Sources from './components/Sources';

export default function App() {
  return (
    <div className="min-h-screen text-white">
      {/* Background overlays */}
      <div className="noise-overlay" />
      <div className="grid-overlay" />
      
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* A. Header */}
        <Header />
        
        {/* B. Main Counter + Context Cards */}
        <MainCounter />
        
        {/* Share Buttons */}
        <ShareButtons />
        
        {/* D. Human Impact */}
        <HumanImpact />
        
        {/* Global Emission Map 
        <GlobalEmissionMap />*/}
        
        {/* Biosphere Degradation - Wildfire Analysis 
        <BiosphereDegradation />*/}
        
        {/* E. Emission Equivalents */}
        <EmissionEquivalents />
        
        {/* F. Carbon Budget
        <CarbonBudget /> */}
        
        {/* G. Absorption Alternatives
        <AbsorptionAlternatives /> */}
        
        {/* Economic Cost */}
        <EconomicCost />
        
        {/* Air Quality & Mortality
        <AirQuality /> */}
        
        {/* H. Sources */}
        <Sources />
        
        {/* I. Action Buttons */}
        <ActionButtons />
        
        {/* J. Footer */}
        <Footer />
      </div>
    </div>
  );
}
