import { paths } from '../routes/path'
import { ReactComponent as IconDashboard } from '../assets/images/icon_dashboard.svg'
import { ReactComponent as IconInventory } from '../assets/images/icon_inventory.svg'
import { ReactComponent as IconItemsRecipes } from '../assets/images/icon_items_recipes.svg'
import { ReactComponent as IconOrder } from '../assets/images/icon_order.svg'
import { ReactComponent as IconReport } from '../assets/images/icon_report.svg'
import { ReactComponent as IconHistory } from '../assets/images/icon_history.svg'
import { ReactComponent as IconSetting } from '../assets/images/icon_setting.svg'
import { ReactComponent as IconHome } from '../assets/images/icon_home.svg'
import { BiUserCircle } from 'react-icons/bi'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { PiCrownSimple } from 'react-icons/pi'
import { AiOutlineAudit } from 'react-icons/ai'

export const barOwnerSideBarItems = [
  {
    name: 'Multi Venue',
    href: paths.owner.multiVenueDashboard,
    icon: IconDashboard,
    submenu: false,
    hidden: true,
  },

  {
    name: 'Dashboard',
    href: paths.owner.dashboard,
    icon: IconHome,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Inventory',
    href: paths.owner.inventory,
    icon: IconInventory,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Item & Recipe',
    href: paths.owner.itemsRecipes,
    href: paths.owner.items,
    icon: IconItemsRecipes,
    submenu: false,
    submenu: true,
    subMenuItems: [
      {
        name: 'Item',
        href: paths.owner.items,
      },
      {
        name: 'Recipe',
        href: paths.owner.recipes,
      },
    ],
    hidden: true,
  },

  {
    name: 'Orders',
    href: paths.owner.orders,
    icon: IconOrder,
    submenu: true,
    subMenuItems: [
      {
        name: 'Cart',
        href: paths.owner.cart,
      },
      {
        name: 'Suppliers',
        href: paths.owner.suppliers,
      },
    ],
    hidden: true,
  },
  {
    name: 'Report / analytic ',
    href: paths.owner.reports,
    icon: IconReport,
    submenu: true,
    subMenuItems: [
      {
        name: 'Stocks',
        href: paths.owner.stocks,
      },
      {
        name: 'Sales',
        href: paths.owner.sales,
      },
      {
        name: 'Variances',
        href: paths.owner.variances,
      },
      {
        name: 'Purchase',
        href: paths.owner.purchase,
      },
      {
        name: 'Cost Changes',
        href: paths.owner.costChanges,
      },
    ],
    hidden: true,
  },
  {
    name: 'History',
    href: paths.owner.history,
    icon: IconHistory,
    submenu: true,
    subMenuItems: [
      {
        name: 'Inventory',
        href: paths.owner.historyInventory,
      },
      {
        name: 'Orders',
        href: paths.owner.historyOrders,
      },
    ],
    hidden: true,
  },
  {
    name: 'Settings',
    href: paths.owner.setting,
    icon: IconSetting,
    submenu: true,
    subMenuItems: [
      {
        name: 'Account',
        href: paths.owner.account,
      },
      {
        name: 'Reset Password',
        href: paths.owner.resetPassword,
      },
      {
        name: 'Bar Manager',
        href: paths.owner.barManager,
      },
      {
        name: 'Bar Staff',
        href: paths.owner.staffMember,
      },
      // {
      //   name: 'App & Integration',
      //   href: paths.owner.apps,
      // },
    ],
    hidden: true,
  },
]

export const adminSideBarItems = [
  {
    name: 'Dashboard',
    href: paths.admin.dashboard,
    icon: IconDashboard,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Bar Owners',
    href: paths.admin.barowner,
    icon: BiUserCircle,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Item',
    href: paths.admin.item,
    icon: IconItemsRecipes,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Ingredients',
    href: paths.admin.ingredient,
    icon: IconItemsRecipes,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Inquiries',
    href: paths.admin.inquiry,
    icon: HiOutlineEnvelope,
    submenu: true,
    subMenuItems: [
      {
        name: 'Contact Us',
        href: paths.admin.contactInquiry,
      },
      {
        name: 'Subscription',
        href: paths.admin.subscriptionInquiry,
      },
    ],
    hidden: true,
  },
  {
    name: 'Reports',
    href: paths.admin.reports,
    icon: IconReport,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Masters',
    icon: IconInventory,
    submenu: true,
    subMenuItems: [
      {
        name: 'Categories',
        href: paths.admin.category,
      },
      {
        name: 'Subcategories',
        href: paths.admin.subCategory,
      },
      {
        name: 'Subscriptions',
        href: paths.admin.subscription,
      },
      {
        name: 'Case-Sizes',
        href: paths.admin.caseSize,
      },
      {
        name: 'Unit-Measures',
        href: paths.admin.unitMeasure,
      },
      {
        name: 'Conatiners',
        href: paths.admin.container,
      },
      {
        name: 'Breakage & Loss',
        href: paths.admin.breakageAndLoss,
      },
    ],
    hidden: true,
  },
  {
    name: 'Audit Logs',
    href: paths.admin.auditLogs,
    icon: AiOutlineAudit,
    submenu: false,
    hidden: true,
  },

  {
    name: 'Settings',
    icon: IconSetting,
    submenu: true,
    subMenuItems: [
      {
        name: 'General Settings ',
        href: paths.admin.generalSettings,
      },
      {
        name: 'Mail Settings',
        href: paths.admin.mailSettings,
      },
    ],
    hidden: true,
  },
]

export const barManagerSideBarItems = [
  {
    name: 'Multi Venue',
    href: paths.manager.multiVenueDashboard,
    icon: IconDashboard,
    submenu: false,
    hidden: true,
    module_name: 'MULTI VENUE',
  },

  {
    name: 'Dashboard',
    href: paths.manager.dashboard,
    icon: IconHome,
    submenu: false,
    hidden: true,
    module_name: 'DASHBOARD',
  },
  {
    name: 'Inventory',
    href: paths.manager.inventory,
    icon: IconInventory,
    submenu: false,
    hidden: true,
    module_name: 'INVENTORY',
  },
  {
    name: 'Item & Recipe',
    href: paths.manager.itemsRecipes,
    href: paths.manager.items,
    icon: IconItemsRecipes,
    submenu: false,
    submenu: true,
    module_name: 'ITEM AND RECIPE',
    subMenuItems: [
      {
        name: 'Item',
        href: paths.manager.items,
        module_name: 'ITEM',
      },
      {
        name: 'Recipe',
        href: paths.manager.recipes,
        module_name: 'RECIPE',
      },
    ],
    hidden: true,
  },

  {
    name: 'Orders',
    href: paths.manager.orders,
    icon: IconOrder,
    submenu: true,
    module_name: 'ORDERS',
    subMenuItems: [
      {
        name: 'Cart',
        href: paths.manager.cart,
        module_name: 'CART',
      },
      {
        name: 'Suppliers',
        href: paths.manager.suppliers,
        module_name: 'SUPPLIER',
      },
    ],
    hidden: true,
  },
  {
    name: 'Report / analytic ',
    href: paths.manager.reports,
    icon: IconReport,
    submenu: true,
    module_name: 'REPORT AND ANALYTICS',
    subMenuItems: [
      {
        name: 'Stocks',
        href: paths.manager.stocks,
        module_name: 'STOCK',
      },
      {
        name: 'Sales',
        href: paths.manager.sales,
        module_name: 'SALES',
      },
      {
        name: 'Variances',
        href: paths.manager.variances,
        module_name: 'VARIANCES',
      },
      {
        name: 'Purchase',
        href: paths.manager.purchase,
        module_name: 'PURCHASE',
      },
      {
        name: 'Cost Changes',
        href: paths.manager.costChanges,
        module_name: 'COST CHANGES',
      },
    ],
    hidden: true,
  },
  {
    name: 'History',
    href: paths.owner.history,
    icon: IconHistory,
    submenu: true,
    module_name: 'HISTORY',
    subMenuItems: [
      {
        name: 'Inventory',
        href: paths.manager.historyInventory,
        module_name: 'HISTORY INVENTORY',
      },
      {
        name: 'Orders',
        href: paths.manager.historyOrders,
        module_name: 'ORDER',
      },
    ],
    hidden: true,
  },
  {
    name: 'Settings',
    href: paths.manager.setting,
    icon: IconSetting,
    submenu: true,
    module_name: 'SETTINGS',
    subMenuItems: [
      {
        name: 'Account',
        href: paths.manager.account,
        module_name: 'ACCOUNT',
      },
      {
        name: 'Reset Password',
        href: paths.manager.resetPassword,
        module_name: 'RESET PASSWORD',
      },
      {
        name: 'Bar Staff',
        href: paths.owner.staffMember,
        module_name: 'BAR STAFF',
      },
    ],
    hidden: true,
  },
]

export const mobileViewAdminDropdownItems = [
  {
    name: 'Account',
    href: paths.admin.account,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Reset Password',
    href: paths.admin.resetPassword,
    submenu: false,
    hidden: true,
  },
]

export const mobileViewOwnerDropdownItems = [
  {
    name: 'Account',
    href: paths.owner.account,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Reset Password',
    href: paths.owner.resetPassword,
    submenu: false,
    hidden: true,
  },
  {
    name: 'My Subscription',
    href: paths.owner.mySubscription,
    submenu: false,
    hidden: true,
  },
]

export const mobileViewManagerDropdownItems = [
  {
    name: 'Account',
    href: paths.manager.account,
    submenu: false,
    hidden: true,
  },
  {
    name: 'Reset Password',
    href: paths.manager.resetPassword,
    submenu: false,
    hidden: true,
  },
]
