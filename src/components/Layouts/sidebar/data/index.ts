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
import { TbCashRegister, TbFileInvoice, TbInvoice, TbPackageImport, TbPackages, TbReportAnalytics } from "react-icons/tb";
import { RiAlignItemBottomLine, RiAlignItemLeftFill } from "react-icons/ri";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { AiOutlineProduct } from "react-icons/ai";
import { IoMdMan } from "react-icons/io";
import { FaBoxesStacked, FaFileInvoice, FaFileInvoiceDollar, FaTruckRampBox, FaUsersBetweenLines, FaUsersGear } from "react-icons/fa6";
import { PiEyeDuotone, PiInvoiceBold, PiInvoiceDuotone } from "react-icons/pi";
import { FaShuttleVan } from "react-icons/fa";
import { HiOutlineUsers, HiUserGroup } from "react-icons/hi2";
import { BiSolidCalendarHeart, BiSolidPackage } from "react-icons/bi";
import { TbPackageExport } from "react-icons/tb";
import { PiHandWithdrawDuotone } from "react-icons/pi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { SlCalender } from "react-icons/sl";
import { MdOutlineManageAccounts } from "react-icons/md";
import { TfiUser } from "react-icons/tfi";
import { FcLeave } from "react-icons/fc";
import { FaClipboardUser } from "react-icons/fa6";

export interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<any>;
  color?: string;
  items: NavItem[]; // دائمًا مصفوفة
}

export interface NavSection {
  label: string;
  color?: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "الموردون",
        url: "/dashboard/suppliers",
        icon: FaShuttleVan,
        color: "#10B981",
        items: [],
      },
      {
        title: "العملاء",
        url: "/dashboard/customers",
        icon: HiOutlineUsers,
        color: "#6366F1",
        items: [],
      },

      {
        title: "الفواتير",
        color: "#1C3FB7",

        icon: PiInvoiceDuotone ,
        items: [
          {
            title: "مشتريات",
            color: "#3C50E0",
            url: "/dashboard/invoices/purchases",
            icon: TbInvoice  ,
            items: [],
          },
          {
            title: "مصاريف",
            color: "#3C50E0",

            url: "/dashboard/invoices/expenses",
            icon: LiaFileInvoiceDollarSolid ,
            items: [],
          },
          {
            title: "مبيعات",
            color: "#3C50E0",

            url: "/dashboard/invoices/sales",
            icon: TbFileInvoice,
            items: [],
          },
        ],
      },
      {
        title: "الاصناف",
        icon: TbPackages,
        color: "#FB923C",

        items: [
          {
            title: "اصناف المشتريات",
            url: "/dashboard/items/purchasesItems",
            icon: TbPackageImport,
            color: "#FDBA74",

            items: [],
          },
          {
            title: "اصناف المبيعات",
            url: "/dashboard/items/salesItems",
            color: "#FDBA74",
            icon: TbPackageExport,
            items: [],
          },
        ],
      },
      {
        title: "التقارير",
        icon: TbReportAnalytics ,
        color: "#A41B3C",

        items: [
          {
            title: "تقرير الموظفين",
            url: "/dashboard/reports/employees",
            icon: FaClipboardUser ,
            color: "#A41B31",

            items: [],
          },
          
        ],
      },
      {
        title: "المستودعات",
        color: "#8B5CF6",

        icon: SiHomeassistantcommunitystore,
        items: [
          {
            title: "المواد الاولية",
            url: "/dashboard/inventories/inventory",
            color: "#A78BFA",

            icon: FaTruckRampBox ,
            items: [
              {
                title: "عرض المستودع",
                color: "#A78BFA",

                url: "/dashboard/inventories/inventory",
                icon: PiEyeDuotone ,
                items: [],
              },
              {
                title: "حركات السحب",
                color: "#A78BFA",

                url: "/dashboard/inventories/InventoryWithdraw",
                icon: PiHandWithdrawDuotone ,
                items: [],
              },
            ],
          },
          {
            title: "مستودع الانتاج ",
             color: "#A78BFA",
            url: "/dashboard/inventories/WarehouseTable",
            icon: FaBoxesStacked ,
            items: [],
          },
        ],
      },
      {
        title: "الموظفين",
        icon: FaUsersBetweenLines ,
                                color:"#F43F5E",

        items: [
          {
            title: "ادارة الموظفين",
            url: "/dashboard/HR/management",
            icon: FaUsersGear  ,
                        color:"#FB7185",
            items: [],
          },
          {
            title: "الدوام اليومي",
            url: "/dashboard/HR/attendance",
            icon: SlCalender,
                        color:"#FB7185",

            items: [],
          },
          {
            title: " الإجازات",
            url: "/dashboard/HR/leaves",
            icon: FcLeave ,
                        color:"#FB7185",

            items: [],
          },
          {
            title: " المسحوبات",
            url: "/dashboard/HR/withdrawals",
            icon: TbCashRegister ,
                        color:"#FB7185",

            items: [],
          },
          {
            title: " دفع الرواتب",
            url: "/dashboard/HR/payroll",
            icon: TbCashRegister ,
                        color:"#FB7185",

            items: [],
          },
        ],
      },
      {
        title: "المستخدمين",
        url: "/dashboard/users",
        icon: TfiUser ,
        items: [],
      },
      
    ],
  },
];
