import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import dynamic from 'next/dynamic';
import Header from 'layout/dashboard/header';
import SideBar from 'layout/dashboard/sidebar';
import { SessionProvider } from 'contexts/SessionContext'

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  rootBreadCrumb: {
    padding: theme.spacing(2, 4, 2, 4),
  },
  appBarSpacer: theme.mixins.toolbar,
  
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  mainContent: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },

  mainFooter: {
    height: '10vh',
    overflow: 'auto',
    position: 'absolute',
    backgroundColor: theme.palette.common.white,
  },
  hr: {
    margin: theme.spacing(0, 4, 0, 4)
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  avatar: {
    background: 'none',
    marginRight: -theme.spacing(1.5),
  },
}));

// const StyledBreadcrumb = withStyles((theme: Theme) => ({
//     root: {
//         backgroundColor: theme.palette.common.white,
//         height: 24,
//         color: theme.palette.grey[800],
//         fontWeight: theme.typography.fontWeightRegular,
//         '&:hover, &:focus, &:active': {
//             boxShadow: theme.shadows[1],
//             color: theme.palette.primary.contrastText,
//             backgroundColor: emphasize(theme.palette.primary.main, 0.12),
//         },
//     },
// }))(Chip) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

// function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
//     event.preventDefault();
//     alert('You clicked a breadcrumb.');
// }

const Dashboard = props => {
  const classes = useStyles(props);

  const { n } = props
  const DynamicComponent = dynamic({
    loader: () => {
      if (n === 'inventory-catalog') {
        return import('layout/dashboard/pages/inventory/catalog')
      } else return import('layout/dashboard/main')
    },
    loading: () => <p>Loading ...</p>
  })

  // const nextPage = () => dynamic({
  //   loader: () => {
  //     return import('../../components/layout/dashboard/main');
  //   },
  //   loading: () => <p>Loading ...</p>
  // })

  return (
    <SessionProvider>
      <div className={classes.root}>
        <Header />
        <SideBar />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {/* <div className={classes.rootBreadCrumb}>
            <Breadcrumbs aria-label="breadcrumb" component={StyledBreadcrumb}>
              <StyledBreadcrumb
                  component="a"
                  href="/"
                  label="Home"
                  avatar={
                    <Avatar className={classes.avatar} component={HomeIcon}>
                      <HomeIcon/>
                    </Avatar>
                  }
                  onClick={handleClick}/>
              <StyledBreadcrumb component="a" href="#" label="Catalog" onClick={handleClick}/>
              <StyledBreadcrumb
                  label="Accessories"
                  deleteIcon={<ExpandMoreIcon/>}
                  onClick={handleClick}
                  onDelete={handleClick} component="a"/>
            </Breadcrumbs>
          </div> */}
          <Container maxWidth="lg" className={classes.container}>
            <DynamicComponent className={classes.mainContent} />
            <div className={classes.mainFooter} />
          </Container>
        </main>
      </div>
    </SessionProvider>
  );
}

Dashboard.getInitialProps = ({ query }) => {
  return { n: query.n, title: "Dashboard" }
};

export default Dashboard
