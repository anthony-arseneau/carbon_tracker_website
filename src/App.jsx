import { useEffect, useState } from 'react';
import ActionButtons from './components/ActionButtons';
import EmissionEquivalents from './components/EmissionEquivalents';
import Footer from './components/Footer';
import Header from './components/Header';
import HumanImpact from './components/HumanImpact';
import MainCounter, { VIEWS } from './components/MainCounterV2';
import NavBar from './components/NavBar';
import ShareButtons from './components/ShareButtons';
import CO2SphereVisualization from './components/CO2SphereVisualization'
import Sources from './components/Sources';
import VerticalDepletionGauge from './components/VerticalDepletionGauge';
import { CONFIG, INITIAL_BUDGET_20C, getAcceleratedTotalEmissions } from './config';
import TrajectorySection from './components/TrajectorySection';

export default function App() {
  const [budget20Remaining, setBudget20Remaining] = useState(INITIAL_BUDGET_20C);
  const [activeView, setActiveView] = useState(VIEWS.BUDGET_20C);
  const show20CGauge = activeView === VIEWS.BUDGET_20C;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const elapsedSeconds = (now - CONFIG.startDate) / 1000;
      const spent = getAcceleratedTotalEmissions(elapsedSeconds);
      setBudget20Remaining(Math.max(INITIAL_BUDGET_20C - spent, 0));
    };
    update();
    const interval = setInterval(update, CONFIG.updateInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Background overlays */}
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      {/* A. Navigation Bar (sticky, full-width) */}
      <NavBar />

      {/* Main content */}
      <div className="max-w-5xl w-full mx-auto px-4 py-8 relative z-10">
        {/* B. Header */}
        <Header />

        {/* C. Main Counter + Vertical Gauge */}
        <div className="flex flex-row gap-4 mb-10">
          <div className="flex-1 min-w-0">
            <MainCounter onViewChange={setActiveView} />
          </div>
          {show20CGauge && (
            <div className="hidden lg:flex w-32 shrink-0">
              <VerticalDepletionGauge budgetRemaining={budget20Remaining} />
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <ShareButtons />

        {/* Scale Section */}
        <CO2SphereVisualization />

        {/* Consequences Section */}
        <TrajectorySection />

        {/* D. Human Impact */}
        <HumanImpact />

        {/* I. Action Buttons */}
        <ActionButtons />
      </div>

      {/* J. Footer (full-width, outside max-w container) */}
      <Footer />
    </div>
  );
}

