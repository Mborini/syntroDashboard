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
import { TbFileInvoice } from "react-icons/tb";
import { RiAlignItemLeftFill } from "react-icons/ri";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { AiOutlineProduct } from "react-icons/ai";
import { IoMdMan } from "react-icons/io";
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
        title: "الموردون",
        url: "/dashboard/suppliers",
        icon: ShieldUser,
        items: [],
      },
      {
        title: "العملاء",
        url: "/dashboard/customers",
        icon: ShieldUser,
        items: [],
      },
     
      {
        title: "الفواتير",
        icon: TbFileInvoice ,
        items: [
          {
            title: "مشتريات",
            url: "/dashboard/invoices/purchases",
            icon: DoorClosed,
            items: [],
          },
          {
            title: "مصاريف",
            url: "/dashboard/invoices/expenses",
            icon: DoorClosed,
            items: [],
          },
        ],
      },
      {
        title: "الاصناف",
        icon: RiAlignItemLeftFill ,
        items: [
          {
            title: "اصناف المشتريات",
            url: "/dashboard/items/purchasesItems",
            icon: AiOutlineProduct ,
            items: [],
          },
          {
            title: "اصناف المبيعات",
            url: "/dashboard/items/salesItems",
            icon: AiOutlineProduct,
            items: [],
            
          },
        ],
      },
      {
        title: "المستودعات",
        icon: SiHomeassistantcommunitystore ,
        items: [
          {
            title: "المواد الاولية",
            url: "/dashboard/inventories/inventory",
            icon: DoorClosed,
            items: [{
             title: "عرض المستودع",
            url: "/dashboard/inventories/inventory",
            icon: DoorClosed,
            items: [],
          },
              {
                title: "حركات السحب",
                url: "/dashboard/inventories/InventoryWithdraw",
                icon: DoorClosed,
                items: [],
              },
            ],
          },
          {
            title: "مستودع الانتاج ",
            url: "/dashboard/inventories/InventoryProduction",
            icon: DoorClosed,
            items: [],
          },
        ],
      },
      {
        title: "الموظفين",
        icon: IoMdMan ,
        items: [
          {
            title: "ادارة الموظفين",
            url: "/dashboard/employees/management",
            icon: DoorClosed,
            items: [],
          },
          {
            title: "الدوام اليومي",
            url: "/dashboard/employees/attendance",
            icon: DoorClosed,
            items: [],
          },
        ],
      },
      {
        title: "المستخدمين",
        url: "/dashboard/users",
        icon: UserCog,
        items: [],
      }, {
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
      }, {
        title: "Link Students",
        url: "/dashboard/link",
        icon: UnplugIcon,
        items: [],
      },
      {
        title: "Students",
        url: "/dashboard/students",
        icon: GraduationCap,
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
