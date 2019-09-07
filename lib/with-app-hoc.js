import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from "clsx";
import PropTypes from 'prop-types';
import { Fragment, useState } from "react";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const MySnackbarContentWrapper = props => {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

export default App => {
  const HOC = props => {

    // const [theme] = useSelector(
    //   ({ layout: { theme } }) => [
    //     theme
    //   ]
    // );

    // const dispatch = useDispatch();

    // let currentValue;
    // const handleChangeTheme = newTheme => {
    //   let previousValue = theme;
    //   currentValue = newTheme;
    //   if (previousValue !== currentValue) {
    //     dispatch(LayoutActions.changeTheme(newTheme))
    //   }
    // };

    const [snackBarOptions, setSnackBarOptions] = useState({
      open: false,
      position: {
        vertical: 'top',
        horizontal: 'center'
      },
      message: '',
      variant: 'success',
      duration: 10000
    }
    );

    const showSnackBar = (message, duration = 10000, variant = 'success', position = {
      vertical: 'top',
      horizontal: 'center'
    }) => {
      setSnackBarOptions({
        open: true,
        message,
        position,
        variant,
        duration
      });
    }

    const hideSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackBarOptions({
        ...snackBarOptions,
        open: false
      });
    }

    const { open, message, duration, variant, position: { vertical, horizontal } } = snackBarOptions

    return (
      <Fragment>
        <Snackbar
          anchorOrigin={{
            vertical,
            horizontal
          }}
          open={open}
          autoHideDuration={duration}
          onClose={hideSnackBar}
        >
          <MySnackbarContentWrapper
            onClose={hideSnackBar}
            variant={variant}
            message={message}
          />
        </Snackbar>
        <App
          {...props}
          showSnackBar={showSnackBar}
        />
      </Fragment>
    );
  }

  HOC.getInitialProps = async appContext => {


    let appProps = {};
    if (typeof App.getInitialProps === "function") {
      appProps = await App.getInitialProps(appContext);
    }

    return {
      ...appProps
    };
  }


  return HOC
}
