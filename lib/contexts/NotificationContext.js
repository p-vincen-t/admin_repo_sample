import { amber, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import clsx from "clsx";
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

const MySnackbarContentWrapper = props => {
  const classes = useStyles(props);

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
        </IconButton>
      ]}
      {...other}
    />
  );
};

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["error", "info", "success", "warning"]).isRequired
};


export const ShowMessageContext = React.createContext(() => {
  throw new Error('Forgot to wrap component in ShowMessageContext.Provider');
});

export function NotificationProvider(props) {

  const { children } = props;

  const [{ open, message, duration, variant, position: { vertical, horizontal } }, setOptions] = React.useState({
    message: '',
    open: false,
    duration: 5000,
    variant: "success",
    position: {
      vertical: "top",
      horizontal: "center"
    }
  })

  const showMessage = (
    message,
    duration = 5000,
    variant = "success",
    position = {
      vertical: "top",
      horizontal: "center"
    }
  ) => {
    setOptions({
      open: true,
      message,
      position,
      variant,
      duration
    });
  }

  const hideMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOptions({
      open: false,
      message,
      position: {vertical, horizontal},
      variant,
      duration
    });
  };

  return (
    <Fragment>
      <Snackbar
        anchorOrigin={{
          vertical,
          horizontal
        }}
        open={open}
        autoHideDuration={duration}
        onClose={hideMessage}>
        <MySnackbarContentWrapper
          onClose={hideMessage}
          variant={variant}
          message={message}
        />
      </Snackbar>
      <ShowMessageContext.Provider value={[showMessage, hideMessage]}>
        {children}
      </ShowMessageContext.Provider>
    </Fragment>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node,
};

export function useNotification() {
  const [showMessage, hideMessage] = React.useContext(ShowMessageContext);
  return {
    showNotification: React.useCallback((message) => {
      showMessage(message)
    }, [showMessage]),
    hideNotification: React.useCallback(() => {
      hideMessage(undefined, '')
    }, [hideMessage])
  }
}
