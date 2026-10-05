import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { AppContent } from './app/AppContent';
import { useLearnifyApp } from './hooks/useLearnifyApp';

function App() {
  const model = useLearnifyApp();
  const { state, actions } = model;

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar
        role={state.role}
        items={state.navItems}
        activeTab={state.activeTab}
        open={state.sidebarOpen}
        mobileOpen={state.mobileSidebarOpen}
        onNavigate={actions.navigate}
        onCloseMobile={() => actions.setMobileSidebarOpen(false)}
      />
      {state.mobileSidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => actions.setMobileSidebarOpen(false)} aria-label="Close sidebar" />}

      <div className={`flex h-screen min-w-0 flex-col transition-all duration-200 ${state.sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'}`}>
        <Topbar
          role={state.role}
          profile={state.profile}
          sidebarOpen={state.sidebarOpen}
          notificationOpen={state.notificationOpen}
          profileOpen={state.profileOpen}
          searchOpen={state.searchOpen}
          search={state.globalSearch}
          searchResults={state.searchResults}
          onToggleSidebar={() => actions.setSidebarOpen((value) => !value)}
          onOpenMobileSidebar={() => actions.setMobileSidebarOpen(true)}
          onSearch={actions.setGlobalSearch}
          onToggleSearch={() => actions.setSearchOpen((value) => !value)}
          onToggleNotifications={() => {
            actions.setNotificationOpen((value) => !value);
            actions.setProfileOpen(false);
          }}
          onToggleProfile={() => {
            actions.setProfileOpen((value) => !value);
            actions.setNotificationOpen(false);
          }}
          onNavigate={actions.navigate}
          onLoginAs={actions.goToLogin}
        />
        <AppContent model={model} />
      </div>
    </div>
  );
}

export default App;
