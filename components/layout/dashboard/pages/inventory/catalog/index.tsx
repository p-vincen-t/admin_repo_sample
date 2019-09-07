import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper
    },
    gridList: {
      width: 500,
      height: 450
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)"
    }
  })
);

const Catalog = props => {

  // const [{offset, limit}, _setPaging] = useState({offset: 0, limit: 10})

  // const [products] = useSelector(
  //   ({ productCatalog: { products } }: any) => [
  //     products
  //   ]
  // );
  // maps classes to component
  const classes = useStyles(props);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(CatalogActions.loadMore(offset, limit))    
  // }, [offset, limit])

  return (   
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
          <ListSubheader component="div">December</ListSubheader>
        </GridListTile>
        {/* {products.map((_product: Product) => (
          // <GridListTile key={product.id}>
          //   <img src={tile.img} alt={tile.title} />
          //   <GridListTileBar
          //     title={tile.title}
          //     subtitle={<span>by: {tile.author}</span>}
          //     actionIcon={
          //       <IconButton
          //         aria-label={`info about ${tile.title}`}
          //         className={classes.icon}>
          //         <InfoIcon />
          //       </IconButton>
          //     }
          //   />
          // </GridListTile>
        ))} */}
      </GridList>
    </div>
  );
};

Catalog.getInitialProps = async ({ query }) => {
  return { n: query.n };
};

export default Catalog;
