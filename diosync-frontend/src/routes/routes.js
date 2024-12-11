import { lazy } from 'react'
import { paths } from './path'
const AddRecipe = lazy(() => import('../pages/items_recipes/AddRecipe'))
const Cart = lazy(() => import('../pages/cart/Cart'))
const Suppliers = lazy(() => import('../pages/suppliers/Suppliers'))
const Sales = lazy(() => import('../pages/sales/Sales'))
const Variances = lazy(() => import('../pages/variances/Variances'))
const Purchase = lazy(() => import('../pages/purchase/Purchase'))
const CostChanges = lazy(() => import('../pages/cost_changes/CostChanges'))
const HistoryInventory = lazy(() => import('../pages/history_inventory/HistoryInventory'))
const HistoryOrders = lazy(() => import('../pages/history_orders/HistoryOrders'))
const OrderReceipt = lazy(() => import('../pages/history_orders/OrderReceipt'))
const MySubscription = lazy(() => import('../pages/settings/my_subscription/MySubscription'))
const BarManager = lazy(() => import('../pages/settings/bar_manager/BarManager'))
const MultiVenueDashboard = lazy(() => import('../pages/dashboard/MultiVenueDashboard'))
const Recipes = lazy(() => import('../pages/items_recipes/Recipes'))
const OrderDetail = lazy(() => import('../pages/history_orders/OrderDetail'))
const StaffMember = lazy(() => import('../pages/settings/staff_manager/StaffMember'))

const Login = lazy(() => import('../pages/authentication/Login'))
const AddNewPassword = lazy(() => import('../pages/authentication/AddNewPassword'))
const ForgetPassword = lazy(() => import('../pages/authentication/ForgetPassword'))
const OTP = lazy(() => import('../pages/authentication/OTP'))
const ChangePassword = lazy(() => import('../pages/authentication/ChangePassword'))
const CommonElement = lazy(() => import('../pages/CommonElement'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Inventory = lazy(() => import('../pages/inventory/Inventory'))
const Forms = lazy(() => import('../pages/Forms'))
const AdminDashboard = lazy(() => import('../pages/admin/adminDashboard/AdminDashboard'))
const BarOwnerListing = lazy(() => import('../pages/admin/barOwnerManagement/BarOwnerListing'))
const BarOwnerVenues = lazy(() => import('../pages/admin/barOwnerManagement/barOwnerVenue/BarOwnerVenues'))
const SubscriptionListing = lazy(() => import('../pages/admin/subscriptionManagement.jsx/SubscriptionListing'))
const BarOwnerReports = lazy(() => import('../pages/admin/reports/BarOwnerReport'))
const CategoryListing = lazy(() => import('../pages/admin/masterManagement/categoryManagement/CategoryListing'))
const SubCategoryListing = lazy(
  () => import('../pages/admin/masterManagement/subCategoryManagement/SubCategoryListing'),
)
const CaseSizeListing = lazy(() => import('../pages/admin/masterManagement/caseSizeManagement/CaseSizeListing'))
const UnitMeasureListing = lazy(
  () => import('../pages/admin/masterManagement/unitMeasureManagement/UnitMeasureListing'),
)
const ContainerListing = lazy(() => import('../pages/admin/masterManagement/containerManagement.jsx/ContainerListing'))
const BreakageAndLossListing = lazy(
  () => import('../pages/admin/masterManagement/breakageAndLoss/BreakageAndLossListing'),
)
const ItemsListing = lazy(() => import('../pages/admin/itemManagement/ItemListing'))
const IngredientListing = lazy(() => import('../pages/admin/ingredientManagement/IngredientListing'))
const AuditLogsSettings = lazy(() => import('../pages/admin/auditLogs/AuditLogsListing'))
const AdminProfile = lazy(() => import('../pages/admin/account/AdminProfile'))
const ResetPassword = lazy(() => import('../pages/settings/reset_password/ResetPassword'))
const Account = lazy(() => import('../pages/settings/account/Account'))
const GeneralSettings = lazy(() => import('../pages/admin/settings/generalSettings/GeneralSettings'))
const MailSettings = lazy(() => import('../pages/admin/settings/mailSettings/MailSettings'))
const Items = lazy(() => import('../pages/items_recipes/Items'))
const Stock = lazy(() => import('../pages/stock/Stock'))
const ContactUsInquiry = lazy(() => import('../pages/admin/inquiryManagement/contactUsInquiry/ContactUsInquiry'))
const SubscriptionInquiry = lazy(
  () => import('../pages/admin/inquiryManagement/subscriptionInquiry/SubscriptionInquiry'),
)

export const AuthRoutes = [
  {
    id: 1,
    path: paths.auth.login,
    name: 'Login',
    element: Login,
    isback: false,
  },
  {
    id: 2,
    path: paths.auth.addNewPassword,
    name: 'Add new Password',
    element: AddNewPassword,
    isback: false,
  },
  {
    id: 3,
    path: paths.auth.forgotPassword,
    name: 'Forget Password',
    element: ForgetPassword,
    isback: false,
  },
  {
    id: 4,
    path: paths.auth.otp,
    name: 'OTP',
    element: OTP,
    isback: false,
  },
  {
    id: 5,
    path: paths.auth.changePassword,
    name: 'Change Password',
    element: ChangePassword,
    isback: false,
  },
  {
    id: 6,
    path: paths.auth.loginUser,
    name: 'Login',
    element: Login,
    isback: false,
  },
]

export const BarOwnerRoutes = [
  {
    id: 1,
    path: paths.owner.multiVenueDashboard,
    name: 'Dashboard',
    element: MultiVenueDashboard,
  },
  {
    id: 2,
    path: paths.owner.dashboard,
    name: 'Dashboard',
    element: Dashboard,
    isback: false,
  },
  {
    id: 3,
    path: paths.owner.inventory,
    name: 'Inventory',
    element: Inventory,
    isback: false,
  },
  {
    id: 4,
    path: paths.owner.items,
    name: 'Item',
    element: Items,
    isback: false,
  },
  {
    id: 4,
    path: paths.owner.recipes,
    name: 'Recipe',
    element: Recipes,
    isback: false,
  },
  {
    id: 5,
    path: paths.owner.addRecipe,
    name: 'Add Recipe',
    element: AddRecipe,
    isback: true,
  },
  {
    id: 6,
    path: paths.owner.cart,
    name: 'Cart',
    element: Cart,
    isback: false,
  },
  {
    id: 7,
    path: paths.owner.suppliers,
    name: 'Suppliers',
    element: Suppliers,
    isback: false,
  },
  {
    id: 8,
    path: paths.owner.stocks,
    name: 'Stock',
    element: Stock,
    isback: false,
  },
  {
    id: 9,
    path: paths.owner.sales,
    name: 'Sales',
    element: Sales,
    isback: false,
  },
  {
    id: 10,
    path: paths.owner.variances,
    name: 'Variances',
    element: Variances,
    isback: false,
  },
  {
    id: 11,
    path: paths.owner.purchase,
    name: 'Purchase',
    element: Purchase,
    isback: false,
  },
  {
    id: 12,
    path: paths.owner.costChanges,
    name: 'Cost Changes',
    element: CostChanges,
    isback: false,
  },
  {
    id: 13,
    path: paths.owner.historyInventory,
    name: 'Inventory',
    element: HistoryInventory,
    isback: false,
  },
  {
    id: 14,
    path: paths.owner.historyOrders,
    name: 'Orders',
    element: HistoryOrders,
    isback: false,
  },
  {
    id: 15,
    path: `${paths.owner.orderReceipt}/:unique_order_id/:orderId`,
    name: 'Order receipt',
    element: OrderReceipt,
    isback: true,
  },
  {
    id: 16,
    path: `${paths.owner.orderDetail}/:unique_order_id/:orderId`,
    name: 'Orders details',
    element: OrderDetail,
    isback: true,
  },
  {
    id: 17,
    path: paths.owner.resetPassword,
    name: 'Reset Password',
    element: ResetPassword,
    isback: false,
  },
  {
    id: 18,
    path: paths.owner.account,
    name: 'Account',
    element: Account,
    isback: false,
  },
  {
    id: 19,
    path: paths.owner.mySubscription,
    name: 'Subscription details',
    element: MySubscription,
    isback: false,
  },
  {
    id: 20,
    path: paths.owner.barManager,
    name: 'Bar Manager',
    element: BarManager,
    isback: false,
  },
  {
    id: 21,
    path: paths.owner.staffMember,
    name: 'Bar Staff',
    element: StaffMember,
    isback: false,
  },
  {
    id: 22,
    path: '/commonelements',
    name: 'Commonelements',
    element: CommonElement,
    isback: false,
  },
  {
    id: 23,
    path: '/forms',
    name: 'Forms',
    element: Forms,
    isback: false,
  },
  {
    id: 5,
    path: `${paths.owner.editRecipe}/:recipeId`,
    name: 'Edit Recipe',
    element: AddRecipe,
    isback: true,
  },
]
export const BarManagerRoutes = [
  {
    id: 1,
    path: paths.manager.multiVenueDashboard,
    name: 'Dashboard',
    element: MultiVenueDashboard,
  },
  {
    id: 2,
    path: paths.manager.dashboard,
    name: 'Dashboard',
    element: Dashboard,
    isback: false,
  },
  {
    id: 3,
    path: paths.manager.inventory,
    name: 'Inventory',
    element: Inventory,
    isback: false,
  },
  {
    id: 4,
    path: paths.manager.items,
    name: 'Item',
    element: Items,
    isback: false,
  },
  {
    id: 4,
    path: paths.manager.recipes,
    name: 'Recipe',
    element: Recipes,
    isback: false,
  },
  {
    id: 5,
    path: paths.manager.addRecipe,
    name: 'Add Recipe',
    element: AddRecipe,
    isback: true,
  },
  {
    id: 6,
    path: paths.manager.cart,
    name: 'Cart',
    element: Cart,
    isback: false,
  },
  {
    id: 7,
    path: paths.manager.suppliers,
    name: 'Suppliers',
    element: Suppliers,
    isback: false,
  },
  {
    id: 8,
    path: paths.manager.stocks,
    name: 'Stock',
    element: Stock,
    isback: false,
  },
  {
    id: 9,
    path: paths.manager.sales,
    name: 'Sales',
    element: Sales,
    isback: false,
  },
  {
    id: 10,
    path: paths.manager.variances,
    name: 'Variances',
    element: Variances,
    isback: false,
  },
  {
    id: 11,
    path: paths.manager.purchase,
    name: 'Purchase',
    element: Purchase,
    isback: false,
  },
  {
    id: 12,
    path: paths.manager.costChanges,
    name: 'Cost Changes',
    element: CostChanges,
    isback: false,
  },
  {
    id: 13,
    path: paths.manager.historyInventory,
    name: 'Inventory',
    element: HistoryInventory,
    isback: false,
  },
  {
    id: 14,
    path: paths.manager.historyOrders,
    name: 'Orders',
    element: HistoryOrders,
    isback: false,
  },
  {
    id: 15,
    path: `${paths.manager.orderReceipt}/:unique_order_id/:orderId`,
    name: 'Order receipt',
    element: OrderReceipt,
    isback: true,
  },
  {
    id: 16,
    path: `${paths.manager.orderDetail}/:unique_order_id/:orderId`,
    name: 'Orders details',
    element: OrderDetail,
    isback: true,
  },
  {
    id: 17,
    path: paths.manager.resetPassword,
    name: 'Reset Password',
    element: ResetPassword,
    isback: false,
  },
  {
    id: 18,
    path: paths.manager.account,
    name: 'Account',
    element: Account,
    isback: false,
  },
  {
    id: 19,
    path: paths.manager.mySubscription,
    name: 'Subscription details',
    element: MySubscription,
    isback: true,
  },
  {
    id: 20,
    path: paths.manager.barManager,
    name: 'Bar Manager',
    element: BarManager,
    isback: false,
  },
  {
    id: 21,
    path: paths.manager.staffMember,
    name: 'Bar Staff',
    element: StaffMember,
    isback: false,
  },
  {
    id: 23,
    path: `${paths.manager.editRecipe}/:recipeId`,
    name: 'Edit Recipe',
    element: AddRecipe,
    isback: true,
  },
]
export const SuperAdminRoutes = [
  {
    id: 1,
    path: paths.admin.dashboard,
    name: 'Dashboard',
    element: AdminDashboard,
    isback: false,
  },
  {
    id: 2,
    path: paths.admin.barowner,
    name: 'Bar Owners',
    element: BarOwnerListing,
    isback: false,
  },
  {
    id: 3,
    path: paths.admin.subscription,
    name: 'Subscriptions',
    element: SubscriptionListing,
    isback: false,
  },
  {
    id: 4,
    path: paths.admin.contactInquiry,
    name: 'Contact Us',
    element: ContactUsInquiry,
    isback: false,
  },
  {
    id: 5,
    path: paths.admin.reports,
    name: 'Reports',
    element: BarOwnerReports,
    isback: false,
  },
  {
    id: 6,
    path: paths.admin.category,
    name: 'Categories',
    element: CategoryListing,
    isback: false,
  },
  {
    id: 7,
    path: paths.admin.subCategory,
    name: 'Subcategories',
    element: SubCategoryListing,
    isback: false,
  },
  {
    id: 8,
    path: paths.admin.caseSize,
    name: 'Case-Sizes',
    element: CaseSizeListing,
    isback: false,
  },
  {
    id: 8,
    path: paths.admin.unitMeasure,
    name: 'Unit-Measures',
    element: UnitMeasureListing,
    isback: false,
  },
  {
    id: 9,
    path: paths.admin.container,
    name: 'Conatiners',
    element: ContainerListing,
    isback: false,
  },
  {
    id: 10,
    path: paths.admin.breakageAndLoss,
    name: 'Breakage & Loss',
    element: BreakageAndLossListing,
    isback: false,
  },
  {
    id: 11,
    path: paths.admin.item,
    name: 'Items',
    element: ItemsListing,
    isback: false,
  },
  {
    id: 12,
    path: paths.admin.ingredient,
    name: 'Ingredients',
    element: IngredientListing,
    isback: false,
  },
  {
    id: 13,
    path: paths.admin.generalSettings,
    name: 'General Settings',
    element: GeneralSettings,
    isback: false,
  },
  {
    id: 14,
    path: paths.admin.mailSettings,
    name: 'Mail Settings',
    element: MailSettings,
    isback: false,
  },
  {
    id: 15,
    path: paths.admin.auditLogs,
    name: 'Audit Logs',
    element: AuditLogsSettings,
    isback: false,
  },
  {
    id: 16,
    path: paths.admin.account,
    name: 'Account',
    element: AdminProfile,
    isback: false,
  },
  {
    id: 17,
    path: paths.admin.resetPassword,
    name: 'Reset Password',
    element: ResetPassword,
    isback: false,
  },
  {
    id: 18,
    path: paths.admin.subscriptionInquiry,
    name: 'Subscription',
    element: SubscriptionInquiry,
    isback: false,
  },
  {
    id: 19,
    path: `${paths.admin.barOwnerVenue}/:ownerId`,
    name: 'Bar Owner Venues',
    element: BarOwnerVenues,
    isback: true,
  },
]

export const routeMatch = {
  Owner: BarOwnerRoutes,
  Manager: BarManagerRoutes,
  SuperAdmin: SuperAdminRoutes,
}
