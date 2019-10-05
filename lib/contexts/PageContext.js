import React from 'react';
// import SessionStorageStore, { CURRENT_PAGE } from 'stores/SessionStorageStore'

// The default value is never and should never be used.
// It's here to improve DX by enabling autocompletion for editors supporting TypeScript.
export const PageContext = React.createContext({
  activePage: {
    pathname: '',
  },
  pages: [],
});

// const PageProvider = props => {

//   // const [currentPage, setCurrentPage] = React.useState(SessionStorageStore.get(CURRENT_PAGE))

//   // const [ sideMenuItems] = useSelector(
//   //   ({ layout: { sideMenuItems } }) => [
//   //     sideMenuItems,
//   //     currentSelectedMenuKey
//   //   ]
//   // );

//   // const handleMenuClick = menuKey => {
//   //   dispatch(LayoutActions.changeCurrentSelectedMenuKey(menuKey));
//   // };

//   // const checkSelectedKeyInGroup = (children: MenuItem[], current: string): boolean => {
//   //   children.forEach(child => {
//   //     if (child.key === current) return true
//   //   });
//   //   return false
//   // }

//   // return (

//   // );

// }

// export default PageProvider
