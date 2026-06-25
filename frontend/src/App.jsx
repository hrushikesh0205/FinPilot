import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { AccountsPage } from '@/pages/AccountsPage';
import { BudgetsPage } from '@/pages/BudgetsPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { ScannerPage } from '@/pages/ScannerPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { HelpPage } from '@/pages/HelpPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  const [currentPage, setCurrentPage] = useState('/');

  const appPages = [
    '/dashboard',
    '/expenses',
    '/categories',
    '/accounts',
    '/budgets',
    '/insights',
    '/scanner',
    '/reports',
    '/notifications',
    '/profile',
    '/settings',
    '/help',
  ];

  const isAppPage = appPages.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case '/login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case '/register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      case '/dashboard':
        return <DashboardPage />;
      case '/expenses':
        return <ExpensesPage />;
      case '/categories':
        return <CategoriesPage />;
      case '/accounts':
        return <AccountsPage />;
      case '/budgets':
        return <BudgetsPage />;
      case '/insights':
        return <InsightsPage />;
      case '/scanner':
        return <ScannerPage />;
      case '/reports':
        return <ReportsPage />;
      case '/notifications':
        return <NotificationsPage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      case '/help':
        return <HelpPage />;
      default:
        return <NotFoundPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      {isAppPage ? (
        <AppLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
          {renderPage()}
        </AppLayout>
      ) : (
        renderPage()
      )}
    </ThemeProvider>
  );
}

export default App;
