import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
// import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import LayoutActions from "appRedux/Layout";
import { useChangeTheme } from "contexts/ThemeContext";
import { MenuItem } from "layout/dashboard/sidebar/MenuItem";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonGroup from '@material-ui/core/ButtonGroup';

// default width of the drawer
const drawerWidth = 260;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootMenu: {
      marginTop: theme.spacing(6),
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflowY: "hidden",
      overflowX: "hidden"
    },
    options: {
      display: "flex",
      padding: theme.spacing(1)
    },
    space: {
      flexGrow: 1
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
    },
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
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

  const [theme, setTheme] = useState(null)

  const [dir, setDir] = useState(null)

  const changeTheme = useChangeTheme()

  useEffect(() => {
    if (theme !== null) changeTheme({ theme })
  }, [theme])

  useEffect(() => {
    if (dir !== null) changeTheme({ dir })
  }, [dir])

  // maps classes to component
  const classes = useStyles(props);

  const dispatch = useDispatch();

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

  const handleOnOpenCloseDrawer = open => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift' || open === true)) {
      return;
    }

    dispatch(LayoutActions.showSideBar(open))
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
    <SwipeableDrawer
      classes={{
        paper: classes.drawerPaper
      }}
      onOpen={handleOnOpenCloseDrawer(true)}
      onClose={handleOnOpenCloseDrawer(false)}
      open={sidebar}>
      <div className={classes.rootMenu}>
        <Divider />
        <List className={classes.list}>
          {handler(sideMenuItems, classes)}
        </List>
        <div className={classes.space} />
        <Divider />
        <div className={classes.options}>
          <ButtonGroup fullWidth aria-label="full width outlined button group">
            <Button
              onClick={() => setTheme(theme === 'red' ? 'default' : 'red')}>
              theme
          </Button>
            <Button
              onClick={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}>
              direction
          </Button>
          </ButtonGroup>
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default SideBar;
