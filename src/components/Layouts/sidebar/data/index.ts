// data.ts
import * as Icons from "../icons";
import {
  DoorClosed,
  GitBranchIcon,
  GraduationCap,
  ShieldUser,
  UnplugIcon,
  User2Icon,
  UserCog,
} from "lucide-react";

export interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<any>;
  items: NavItem[]; // دائمًا مصفوفة
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/dashboard/ecommerce",
            items: [],
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User2Icon,
        items: [],
      },
      {
        title: "Students",
        url: "/dashboard/students",
        icon: GraduationCap,
        items: [],
      },
      {
        title: "Parents",
        url: "/dashboard/parents",
        icon: ShieldUser,
        items: [],
      },
      {
        title: "Link Students",
        url: "/dashboard/link",
        icon: UnplugIcon,
        items: [],
      },
      {
        title: "Classes & Sections",
        icon: DoorClosed,
        items: [
          {
            title: "Classes",
            url: "/dashboard/classes",
            icon: DoorClosed,
            items: [],
          },
          {
            title: "Sections",
            url: "/dashboard/sections",
            icon: GitBranchIcon,
            items: [],
          },
        ],
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: UserCog,
        items: [],
      },
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Form Elements",
            url: "/dashboard/forms/form-elements",
            items: [],
          },
          {
            title: "Form Layout",
            url: "/dashboard/forms/form-layout",
            items: [],
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/dashboard/pages/settings",
            items: [],
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/dashboard/charts/basic-chart",
            items: [],
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/dashboard/ui-elements/alerts",
            items: [],
          },
          {
            title: "Buttons",
            url: "/dashboard/ui-elements/buttons",
            items: [],
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/dashboard/auth/sign-in",
            items: [],
          },
        ],
      },
    ],
  },
];
