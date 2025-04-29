// src/layout/AppSidebar.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { UserRole } from "@/types/entities/user";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
} from "../icons/index";

type NavItem = {
  name: string;
  translationKey: string;
  icon: React.ReactNode;
  path?: string;
  allowedRoles?: UserRole[];
  subItems?: {
    name: string;
    translationKey: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    translationKey: "dashboard",
    allowedRoles: ["ADMIN"],
    subItems: [
      {
        name: "Ecommerce",
        translationKey: "ecommerce",
        path: "/dashboard",
        pro: false,
      },
    ],
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Hackathon",
  //   allowedRoles: ["ADMIN"],
  //   path: "/admin-hackathon-management",
  // },
  // {
  //   icon: <CalenderIcon />,
  //   name: "User",
  //   allowedRoles: ["ADMIN"],
  //   path: "/user-management",
  // },
  {
    icon: <CalenderIcon />,
    name: "User Management",
    translationKey: "userManagement",
    allowedRoles: ["ADMIN"],
    path: "/user-manage",
  },
  {
    icon: <CalenderIcon />,
    name: "Thread Post Report",
    translationKey: "threadPostReport",
    allowedRoles: ["ADMIN"],
    path: "/thread-post-report-management",
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Organization",
  //   allowedRoles: ["ADMIN"],
  //   path: "/organization-management",
  // },
  {
    icon: <CalenderIcon />,
    name: "Mentorship Request",
    translationKey: "mentorshipRequest",
    allowedRoles: ["MENTOR"],
    path: "/mentorship-request",
  },
  {
    icon: <CalenderIcon />,
    name: "Mentor Team",
    translationKey: "mentorTeam",
    allowedRoles: ["MENTOR"],
    path: "/mentor-team",
  },
  {
    icon: <CalenderIcon />,
    name: "Organizer Hackathon",
    translationKey: "organizerHackathon",
    allowedRoles: ["ORGANIZER"],
    path: "/organizer-hackathon-management",
  },
  {
    icon: <CalenderIcon />,
    name: "User Creation",
    translationKey: "userCreation",
    allowedRoles: ["ORGANIZER"],
    path: "/user-creation",
  },
  {
    icon: <CalenderIcon />,
    name: "Grading Submission",
    translationKey: "gradingSubmission",
    allowedRoles: ["JUDGE"],
    path: "/grading-submission",
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    translationKey: "calendar",
    allowedRoles: ["ADMIN", "ORGANIZER", "MENTOR", "JUDGE"],
    path: "/calendar",
  },
  {
    icon: <CalenderIcon />,
    name: "Kanban board",
    translationKey: "kanbanBoard",
    allowedRoles: ["ADMIN", "ORGANIZER", "MENTOR", "JUDGE"],
    path: "/kanban-board",
  },
  {
    icon: <CalenderIcon />,
    name: "Chat",
    translationKey: "chat",
    allowedRoles: ["ADMIN", "ORGANIZER", "MENTOR", "JUDGE"],
    path: "/chat",
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Inbox",
  //   allowedRoles: ["Admin", "Organizer", "Judge", "Mentor"],
  //   path: "/inbox",
  // },
  {
    icon: <CalenderIcon />,
    name: "Send Notification",
    translationKey: "sendNotification",
    allowedRoles: ["ADMIN"],
    path: "/send-notification",
  },
  {
    icon: <CalenderIcon />,
    name: "Blog",
    translationKey: "blog",
    allowedRoles: ["ADMIN"],
    path: "/blog-management",
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.userRoles?.[0]?.role?.name || null;
  const t = useTranslations("sidebar");

  const filteredNavItems = navItems.filter(
    (item) =>
      !item.allowedRoles || item.allowedRoles.includes(userRole as UserRole)
  );

  const filteredOthersItems = othersItems.filter(
    (item) =>
      !item.allowedRoles || item.allowedRoles.includes(userRole as UserRole)
  );

  console.log("User Role in AppSidebar:", userRole);
  console.log("Filtered Nav Items in AppSidebar:", filteredNavItems);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-2 sm:gap-3 md:gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.translationKey}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              } transition-colors duration-200 ease-in-out`}
              aria-expanded={
                openSubmenu?.type === menuType && openSubmenu?.index === index
              }
              aria-controls={`submenu-${menuType}-${index}`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                } transition-colors duration-200`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{t(nav.translationKey)}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  } transition-colors duration-200`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">
                    {t(nav.translationKey)}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              id={`submenu-${menuType}-${index}`}
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-6 sm:ml-7 md:ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.translationKey}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      } transition-colors duration-200 text-xs sm:text-sm`}
                    >
                      {t(subItem.translationKey)}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge text-xs`}
                          >
                            {t("new")}
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge text-xs`}
                          >
                            {t("pro")}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-3 sm:px-4 md:px-5 left-0 
        bg-white dark:bg-gray-900 dark:border-gray-800 
        text-gray-900 dark:text-gray-100 
        h-screen transition-all duration-300 ease-in-out z-50 
        border-r border-gray-200 dark:border-gray-700
        ${
          isExpanded || isMobileOpen
            ? "w-[250px] sm:w-[270px] md:w-[290px]"
            : isHovered
              ? "w-[250px] sm:w-[270px] md:w-[290px]"
              : "w-[70px] sm:w-[80px] md:w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={t("sidebar")}
    >
      <div
        className={`py-6 sm:py-7 md:py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/" aria-label={t("homeLogo")}>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex items-center gap-2">
                <Image
                  className="dark:hidden w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px]"
                  src="/images/logo/logoe.svg"
                  alt={t("logoAlt")}
                  width={60}
                  height={60}
                />
                <Image
                  src="/images/logo/logo-name.svg"
                  alt={t("logoNameAlt")}
                  width={60}
                  height={60}
                  className="dark:hidden w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px]"
                />
                <Image
                  className="hidden dark:block w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px]"
                  src="/images/logo/logoe.svg"
                  alt={t("logoAlt")}
                  width={60}
                  height={60}
                />
              </div>
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt={t("logoIconAlt")}
              width={32}
              height={32}
              className="w-8 h-8 sm:w-8 sm:h-8 md:w-8 md:h-8"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6" aria-label={t("mainNavigation")}>
          <div className="flex flex-col gap-3 sm:gap-3 md:gap-4">
            <div>
              <h2
                className={`mb-3 sm:mb-3 md:mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t("menu")
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
