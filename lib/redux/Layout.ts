import { AnyAction } from "redux";

export const LayoutConstants = {
  SHOW_SIDEBAR: "SHOW_SIDEBARS",
  THEME: "THEME",
  CURRENT_SELECTED_MENU: "CURRENT_SELECTED_MENU"
};

export const LayoutReducer = (
  state = {
    sidebar: true,
    theme: "default",
    sideMenuItems: [
      { key: "1", name: "Dashboard", url: "/" },
      {
        key: "2",
        name: "Inventory",
        children: [
          { key: "3", name: "Catalog", url: "/?n=inventory-catalog" },
          { key: "4",name: "Store", url: "/?n=inventory-store" }
        ]
      },
      { key: "5", name: "Reports", url: "/?n=reports" }
    ],
    currentSelectedMenuKey: "1"
  },
  action: AnyAction
) => {
  switch (action.type) {
    case LayoutConstants.SHOW_SIDEBAR:
      return {
        ...state,
        sidebar: action.show
      };
    case LayoutConstants.THEME:
      return {
        ...state,
        theme: action.theme
      };
    case LayoutConstants.CURRENT_SELECTED_MENU:
      return {
        ...state,
        currentSelectedMenuKey: action.menuKey
      };
    default:
      return state;
  }
};

const LayoutActions = {
  showSideBar: (show: boolean) => (dispatch: any) => {
    dispatch({ type: LayoutConstants.SHOW_SIDEBAR, show });
  },
  changeTheme: (theme: string) => (dispatch: any) => {
    dispatch({ type: LayoutConstants.THEME, theme });
  },
  changeCurrentSelectedMenuKey: (menuKey: string) => (dispatch: any) => {
    dispatch({ type: LayoutConstants.CURRENT_SELECTED_MENU, menuKey });
  }
};

export default LayoutActions;
