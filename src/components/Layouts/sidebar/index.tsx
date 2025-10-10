"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_DATA, NavItem } from "./data";
import { ChevronUp } from "./icons";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActiveItem = (item: NavItem): boolean =>
    item.url === pathname || item.items.some((sub) => isActiveItem(sub));

  const RenderNavItem = ({
    item,
    depth = 1,
  }: {
    item: NavItem;
    depth?: number;
  }) => {
    const isExpanded = expandedItems.includes(item.title);
    const isActive = isActiveItem(item);

    const fontSize =
      depth === 1 ? "text-base" : depth === 2 ? "text-sm" : "text-xs";
    const paddingRight = `${depth * 12}px`;

    const colorStyle = item.color ? { color: item.color } : {}; // ✅ اللون الموحد

    if (item.items.length === 0) {
      return (
        <Link
          dir="rtl"
          href={item.url ?? "/"}
          className={cn(
            "flex items-center gap-3 rounded py-2 transition-colors duration-200",
            fontSize,
            isActive
              ? "bg-gray-200 dark:bg-gray-500 text-gray-600 dark:text-gray-100"
              : "hover:bg-gray-100 dark:hover:bg-gray-500"
          )}
          style={{ paddingRight, ...colorStyle }} // ✅ تطبيق اللون على النص ككل
        >
          {item.icon && (
            <item.icon
              color={item.color || "inherit"} // ✅ نفس اللون للأيقونة
              className="size-5 shrink-0 font-bold"
            />
          )}
          <span>{item.title}</span>
        </Link>
      );
    }

    return (
      <div>
        <button
          onClick={() => toggleExpanded(item.title)}
          className={cn(
            "flex w-full items-center gap-3 rounded py-2 font-bold transition-colors duration-200",
            fontSize,
            isActive
              ? "bg-gray-200 dark:bg-gray-500 text-gray-600 dark:text-gray-100"
              : "hover:bg-gray-100 dark:hover:bg-gray-500"
          )}
          style={{ paddingRight, ...colorStyle }} // ✅ اللون للنص والأيقونة
          dir="rtl"
        >
          {item.icon && (
            <item.icon
              color={item.color || "inherit"} // ✅ نفس اللون
              className="size-5 shrink-0 font-bold"
            />
          )}
          <span>{item.title}</span>
          <ChevronUp
            className={cn(
              "ml-auto transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>

        {isExpanded && (
          <ul className="mr-6 mt-1 space-y-1 font-bold">
            {item.items.map((sub) => (
              <li key={sub.title}>
                <RenderNavItem item={sub} depth={depth + 1} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <aside className="h-screen w-72 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {NAV_DATA.map((section) => (
        <div key={section.label} className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            {section.label}
          </h2>
          <ul className="space-y-1 font-bold">
            {section.items.map((item) => (
              <li key={item.title}>
                <RenderNavItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
