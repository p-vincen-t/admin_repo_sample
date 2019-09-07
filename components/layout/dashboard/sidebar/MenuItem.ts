/**
 * Type stub for each menu item
 */
export type MenuItem = {
  // unique key for each item
  key: string;
  // the name displayed
  name: string;
  // the link to redirect to when clicked
  url?: string;
  // children ffor this menu item if there are any
  children?: MenuItem[];
};
