import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  RotateCcw,
  User,
  MessageSquare,
  BarChartBig,
  Utensils,
  ShieldCheck,
  CircleDollarSign,
  WalletCards,
  Fingerprint,
  ChevronDown,
  Info,
  Trophy,
  Dumbbell,
  Menu,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Members', 'Reports', 'Team']);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSubMenu = (menuTitle: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuTitle) ? prev.filter((m) => m !== menuTitle) : [...prev, menuTitle]
    );
  };

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutGrid size={18} /> },
    { title: 'Enquiries', path: '/admin/enquiries', icon: <Users size={18} /> },
    { title: 'Follow Ups', path: '/admin/follow-ups', icon: <RotateCcw size={18} /> },
    {
      title: 'Members',
      icon: <User size={18} />,
      subItems: [
        { title: 'Database', path: '/admin/members' },
        { title: 'Packages', path: '/admin/packages' },
        { title: 'Subscriptions', path: '/admin/subscriptions' },
        { title: 'Workout Cards', path: '/admin/workout-cards' },
        { title: 'Analytics', path: '/admin/analytics' },
      ],
    },
    { title: 'Feedback Management', path: '/admin/feedback', icon: <MessageSquare size={18} /> },
    {
      title: 'Reports',
      icon: <BarChartBig size={18} />,
      subItems: [
        { title: 'Balance Due', path: '/admin/reports/balance-due' },
        { title: 'Sales Report', path: '/admin/reports/sales' },
        { title: 'Expired Members', path: '/admin/reports/expired' },
        { title: 'Attendance Audit', path: '/admin/reports/attendance' },
        { title: 'PT Report', path: '/admin/reports/pt' },
      ],
    },
    { title: 'DietPlan Management', path: '/admin/diet-plan', icon: <Utensils size={18} /> },
    { title: 'Success Story Lab', path: '/admin/success-stories', icon: <Trophy size={18} /> },
    { title: 'Workout Library', path: '/admin/workout-library', icon: <Dumbbell size={18} /> },
    { header: 'Business Setting' },
    {
      title: 'Team',
      icon: <ShieldCheck size={18} />,
      subItems: [
        { title: 'Employees', path: '/admin/business/employees' },
        { title: 'Staff Attendance', path: '/admin/business/attendance' },
      ],
    },
    { title: 'Payments & Invoices', path: '/admin/business/payments', icon: <CircleDollarSign size={18} /> },
    { title: 'Expense Management', path: '/admin/business/expenses', icon: <WalletCards size={18} /> },
    { header: 'Setting' },
    { title: 'Biometric Devices', path: '/admin/settings/biometric', icon: <Fingerprint size={18} /> },
    { title: 'Gym Details', path: '/admin/settings/gym', icon: <Info size={18} /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="admin-mobile-toggle"
        aria-label="Toggle Sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar Container */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">
            <span className="admin-sidebar-icon">🏋️</span>
            {!collapsed && <span className="admin-sidebar-text">Gym Admin Panel</span>}
          </div>
          {onToggleCollapse && (
            <button onClick={onToggleCollapse} className="admin-sidebar-collapse-btn" title="Toggle Sidebar">
              {collapsed ? '▶' : '◀'}
            </button>
          )}
        </div>

        <div className="admin-sidebar-scroll">
          <nav className="admin-sidebar-nav">
            {menuItems.map((item, idx) => {
              if (item.header) {
                return (
                  <div key={idx} className="admin-sidebar-section-header">
                    {!collapsed && <span>{item.header}</span>}
                    {collapsed && <div className="admin-sidebar-divider" />}
                  </div>
                );
              }

              const isSubMenu = !!item.subItems;
              const isExpanded = !!item.title && expandedMenus.includes(item.title);
              const isAnySubActive = isSubMenu && item.subItems?.some((sub) => location.pathname === sub.path);
              const isActive = !isSubMenu && (location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/dashboard'));

              return (
                <div key={idx} className="admin-sidebar-item-wrapper">
                  {isSubMenu ? (
                    <>
                      <button
                        type="button"
                        onClick={() => item.title && toggleSubMenu(item.title)}
                        className={`admin-sidebar-btn ${isAnySubActive ? 'active' : ''}`}
                        title={collapsed ? item.title : undefined}
                      >
                        <div className="admin-sidebar-btn-left">
                          <span className="admin-sidebar-item-icon">{item.icon}</span>
                          {!collapsed && <span className="admin-sidebar-item-label">{item.title}</span>}
                        </div>
                        {!collapsed && (
                          <ChevronDown
                            size={14}
                            className={`admin-sidebar-arrow ${isExpanded ? 'rotated' : ''}`}
                          />
                        )}
                      </button>

                      {!collapsed && isExpanded && (
                        <div className="admin-sidebar-submenu">
                          {item.subItems?.map((sub, sIdx) => {
                            const subActive = location.pathname === sub.path || (sub.path === '/admin/members' && location.pathname.startsWith('/admin/members'));
                            return (
                              <NavLink
                                key={sIdx}
                                to={sub.path}
                                onClick={() => setMobileOpen(false)}
                                className={`admin-sidebar-sublink ${subActive ? 'active' : ''}`}
                              >
                                {sub.title}
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path!}
                      onClick={() => setMobileOpen(false)}
                      className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                      title={collapsed ? item.title : undefined}
                      end={item.path === '/admin'}
                    >
                      <span className="admin-sidebar-item-icon">{item.icon}</span>
                      {!collapsed && <span className="admin-sidebar-item-label">{item.title}</span>}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
