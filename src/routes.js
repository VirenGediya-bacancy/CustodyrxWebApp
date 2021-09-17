import DrugDetail from "./views/drugs/DrugsDetail";
import DisposableDetail from './views/disposable/DisposableDetail';
import Drugs from "./views/drugs/Drugs";
import AddDrug from './views/drugs/AddDrug'
import Disposable from './views/disposable/Disposable'
import AddDisposable from './views/disposable/AddDisposable'
import EditDrug from "./views/drugs/EditDrug";
import EditDisposable from "views/disposable/EditDisposable";
import  Assets from "views/assets/Assets";
import AddAsset from "views/assets/AddAsset";
import AssetDetails from "container/Assets/AssetDetails";
import NotFoundPage from "commonComponents/NotFoundPage";
import Users from "views/Users/Users";
import UserOverview from "views/Users/UserOverview";
import AddUser from "views/Users/AddUser";

/**
 * Define routes to navigate between the pages
 */
const dashboardRoutes = [
  {
    path: "/drugs",
    name: "Drugs",
    icon: "fas fa-circle",
    component: Drugs,
    module: 'drug',
    layout: "",
  },
  {
    path: "/drug/:drug_id",
    name: "Drug details",
    icon: "nc-icon nc-circle-09",
    component: DrugDetail,
    module: 'drug',
    layout: "/",
  },
  {
    path: "/drug/:drug_id/:drug_item_id",
    name: "Drug details",
    icon: "nc-icon nc-circle-09",
    component: DrugDetail,
    module: 'drug',
    layout: "/",
  },
  {
    path: "/addDrug",
    name: "Drug details",
    icon: "nc-icon nc-circle-09",
    module: 'drug',
    component: AddDrug,
    layout: "/",
  },
  {
    path: "/assets",
    name: "Assets",
    icon: "far fa-square",
    module: 'asset',
    component: Assets,
    layout: "",
  },
  {
    path: "/addAsset",
    name: "Add Asset",
    icon: "nc-icon nc-circle-09",
    module: 'asset',
    component: AddAsset,
    layout: "/",
  },
  {
    path: "/asset/:assetId",
    name: "Asset Detais",
    icon: "nc-icon nc-circle-09",
    module: 'asset',
    component: AssetDetails,
    layout: "/",
  },
  {
    path: "/asset/:assetId/:asset_item_id",
    name: "Asset Detais",
    icon: "nc-icon nc-circle-09",
    module: 'asset',
    component: AssetDetails,
    layout: "/",
  },
  {
    path: "/editAsset/:assetId",
    name: "Asset details",
    icon: "fas fa-table",
    module: 'asset',
    component: AddAsset,
    layout: "/",
  },
  {
    path: "/editDrug/:drug_id",
    name: "Drug details",
    icon: "fas fa-table",
    module: 'drug',
    component: EditDrug,
    layout: "/",
  },
  {
    path: "/disposables",
    name: "Disposables",
    icon: "fas fa-table",
    module: 'disposable',
    component: Disposable,
    layout: "",
  },
  {
    path: "/addDisposable",
    name: "Disposable details",
    icon: "fas fa-table",
    module: 'disposable',
    component: AddDisposable,
    layout: "/",
  },
  {
    path: "/disposable/:disposable_id",
    name: "Disposable details",
    icon: "fas fa-table",
    module: 'disposable',
    component: DisposableDetail,
    layout: "/",
  },
  {
    path: "/disposable/:disposable_id/:disposable_item_id",
    name: "Disposable details",
    icon: "fas fa-table",
    module: 'disposable',
    component: DisposableDetail,
    layout: "/",
  },
  {
    path: "/editDisposable/:disposable_id",
    name: "Disposable details",
    icon: "fas fa-table",
    module: 'disposable',
    component: EditDisposable,
    layout: "/",
  },
  {
    path: "/users",
    name: "Users & Roles",
    icon: "fas fa-user",
    module: 'user',
    component: Users,
    layout: "",
  },
  {
    path: "/user/:userId",
    name: "User Overview",
    icon: "fas fa-table",
    module: 'user',
    component: UserOverview,
    layout: "/",
  },
  {
    path: "/addUser",
    name: "User Overview",
    icon: "fas fa-table",
    module: 'user',
    component: AddUser,
    layout: "/",
  },  
  {
    path: "/editUser/:userId",
    name: "Edit User",
    icon: "fas fa-table",
    module: 'user',
    component: AddUser,
    layout: "/",
  },  
  {
    path: "/not-found",
    name: "Not Found",
    icon: "fas fa-table",
    component: NotFoundPage,
    layout: "/",
  },
  
  
];

export default dashboardRoutes;
