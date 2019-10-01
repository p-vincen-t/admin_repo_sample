import Collapse from "@material-ui/core/Collapse";
// import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutActions from "appRedux/Layout";
import { MenuItem } from "layout/dashboard/sidebar/MenuItem";

// default width of the drawer
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootMenu: {
      display: "flex",
      flexDirection: "column"
    },
    spacer: {
      flex: 1
    },
    list: {
      width: drawerWidth
    },
    links: {
      textDecoration: "none"
    },
    menuHeader: {
      paddingLeft: "30px"
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
      }
    }
  })
);
/**
 * Sidebar component
 * @param props
 */
const SideBar = props => {
  /**
   * extacts sidebar, menu items and current selected menu key from the state
   */
  const [sidebar, sideMenuItems, currentSelectedMenuKey] = useSelector(
    ({ layout: { sideMenuItems, sidebar, currentSelectedMenuKey } }: any) => [
      sidebar,
      sideMenuItems,
      currentSelectedMenuKey
    ]
  );
  // maps classes to component
  const classes = useStyles(props);

  const dispatch = useDispatch();
  // hides the drawer
  const handleDrawerClose = () => {
    dispatch(LayoutActions.showSideBar(false));
  };
  // // handles them change
  // const handleThemeChange = () => {
  //   dispatch(LayoutActions.changeTheme("red"));
  // };
  // opens the drawer
  const handleDrawerOpen = () => {
    dispatch(LayoutActions.showSideBar(true));
  };
  // changes current selected menu
  const handleMenuClick = menuKey => {
    dispatch(LayoutActions.changeCurrentSelectedMenuKey(menuKey));
  };

  const checkSelectedKeyInGroup = (children: MenuItem[], current: string): boolean => {
    children.forEach(child => {
      if (child.key === current) return true
    });
    return false
  }

  const [collaped, setCollapsed] = useState(!checkSelectedKeyInGroup(sideMenuItems, currentSelectedMenuKey));

  const handler = (menuItems: MenuItem[], { links }) => menuItems.map((menuItem: MenuItem) => {
    if (!menuItem.children) {
      return (
        <ListItem
          button
          key={menuItem.key}
          onClick={() => handleMenuClick(menuItem.key)}>
          <Link
            href={menuItem.url}
            className={links}>
            <ListItemText inset primary={menuItem.name} />
          </Link>
        </ListItem>
      );
    }
    return (
      <Fragment
        key={menuItem.key}>
        <ListItem
          button
          onClick={() => setCollapsed(!collaped)}>
          <ListItemText inset primary={menuItem.name} />
          {collaped ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={collaped} timeout="auto" >
          {handler(menuItem.children, { links })}
        </Collapse>
      </Fragment>
    );
  })

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !sidebar && classes.drawerPaperClose)
      }}
      open={sidebar}>
      <div className={classes.toolbarIcon}>
        {sidebar ? (
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        ) : (
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          )}
      </div>
      <div className={classes.rootMenu}>
        <Divider />
        <List>{handler(sideMenuItems, classes)}</List>
        {/* <Divider /> */}
        {/* <List>{secondaryListItems}</List> */}
        {/* <Container className={classes.spacer} /> */}
        {/* <div
          style={{
            alignSelf: "center"
          }}>
          <Button
            variant="contained"
            onClick={handleThemeChange}
            color="inherit">
            Red Theme
          </Button>
        </div> */}
      </div>
    </Drawer>
  );
};

export default SideBar;
