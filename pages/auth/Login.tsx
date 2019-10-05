import { createStyles, FormControl, FormHelperText, InputAdornment, Paper, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Email, LockOpen } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import AuthActions from "appRedux/Auth";
import { useNotification } from "contexts/NotificationContext";
import redirectTo from "lib/redirect";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(2, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },

    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  })
);

const LoginPage = props => {

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const { showNotification } = useNotification()
  // const [showPassword, setShowPassword] = useState(false)

  const [{ passwordError, identifierError }, loading] = useSelector(
    ({ auth: { errors: { passwordError, identifierError }, loading } }: any) => [
      {
        passwordError: passwordError || false,
        identifierError: identifierError || false
      },
      loading
    ]
  );

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(AuthActions.setLoggedIntoFalse());
  }, [])

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === "identifier") {
      setIdentifier(value)
      // this.setState({
      //   identifier: value,
      //   errors: {
      //     email: false
      //   }
      // });
    } else {
      setPassword(value)
      // this.setState({
      //   password: value,
      //   errors: {
      //     password: false
      //   }
      // });
    }

  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    const { next } = props;
    // showSnackBar(' logging in', 20000)
    // return
    e.preventDefault();
    dispatch(
      AuthActions.login(identifier, password, () => {
        showNotification('successfully logged in, redirecting in a bit')
        setTimeout(() => {
          redirectTo(next);
        }, 500);
      })
    );
  };

  const classes = useStyles(props);

  const { message } = props;

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper}>
        {loading ? <LinearProgress variant="query" /> : ""}
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        {message ? (
          <Typography component="h1" variant="h5">
            {message}
          </Typography>
        ) : (
            ""
          )}
        <Typography component="h3" variant="h5">
          Sign In
        </Typography>
        {/* {loggedIn ? <Typography component='h2' variant='caption'>
          You have successfully logged in, redirecting you in a moment...
        </Typography> : ''} */}
        <form className={classes.form} onSubmit={onSubmit} noValidate>
          <FormControl margin="normal" required fullWidth>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="identifier"
              error={identifierError ? true : false}
              label="Email or Phone"
              name="identifier"
              onChange={handleInputChange}
              autoComplete="email"
              autoFocus
              value={identifier}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                )
              }}
            />
            {identifierError ? (
              <FormHelperText error id="component-error-text">
                {identifierError}
              </FormHelperText>
            ) : (
                ""
              )}
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              error={passwordError ? true : false}
              autoComplete="current-password"
              onChange={handleInputChange}
              value={password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen />
                  </InputAdornment>
                )
              }}
            />
            {passwordError ? (
              <FormHelperText error id="component-error-text">
                {passwordError}
              </FormHelperText>
            ) : (
                ""
              )}
          </FormControl>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign In
          </Button>          
        </form>
      </Paper>
    </Container>
  );
}

LoginPage.getInitialProps = ({ query }) => {
  let props = {
    title: "Login",
    next: ""
  };
  props.next = query.continue ? query.continue : "/";

  return props;
}

export default LoginPage;
