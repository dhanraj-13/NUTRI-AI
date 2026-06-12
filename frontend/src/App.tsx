import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/shared/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage, RegisterPage } from './components/auth/AuthPages';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './components/pages/DashboardPage';
import { AIChatPage } from './components/pages/AIChatPage';
import { NutritionPage } from './components/pages/NutritionPage';
import { MealsPage } from './components/pages/MealsPage';
import { HydrationPage } from './components/pages/HydrationPage';
import { ProductivityPage } from './components/pages/ProductivityPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import {
  SettingsPage,
  RemindersPage,
  UploadsPage,
  MonitoringPage,
  PlannerPage,
  GoalsPage,
} from './components/pages/RemainingPages';

function AppContent() {
  const { state } = useApp();
  const { page, authState } = state;

  // Unauthenticated pages
  if (authState === 'unauthenticated') {
    if (page === 'login') return <LoginPage />;
    if (page === 'register') return <RegisterPage />;
    return <LandingPage />;
  }

  // Onboarding
  if (page === 'onboarding' || authState === 'onboarding') {
    return <OnboardingFlow />;
  }

  // Authenticated app pages
  const pageComponents: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage />,
    'ai-chat': <AIChatPage />,
    nutrition: <NutritionPage />,
    meals: <MealsPage />,
    hydration: <HydrationPage />,
    productivity: <ProductivityPage />,
    analytics: <AnalyticsPage />,
    planner: <PlannerPage />,
    goals: <GoalsPage />,
    profile: <ProfilePage />,
    settings: <SettingsPage />,
    reminders: <RemindersPage />,
    uploads: <UploadsPage />,
    monitoring: <MonitoringPage />,
  };

  return (
    <AppShell>
      <div key={page} className="page-enter">
        {pageComponents[page] || <DashboardPage />}
      </div>
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}
