import {
  createStyles,
  FormControl,
  FormHelperText,
  InputAdornment,
  Paper,
  Theme
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Email, LockOpen } from "@material-ui/icons";
import { withStyles, WithStyles } from "@material-ui/styles";
import { Component } from "react";
import { connect } from "react-redux";
import AuthActions from "appRedux/Auth";
import redirectTo from "lib/redirect";

const styles = (theme: Theme) =>
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
  });

interface Props extends WithStyles<typeof styles> {
  next;
  showSnackBar;
  dispatch;
  loggedIn;
  errors?;
  message?;
  loading?;
}

class LoginPage extends Component<
  Props,
  {
    identifier: string;
    password: string;
    errors: object;
  }
> {
  static getInitialProps({ query }) {
    let props = {
      title: "Login",
      next: ""
    };
    props.next = query.continue ? query.continue : "/";

    return props;
  }

  state = {
    identifier: "",
    password: "",
    errors: {
      password: false,
      email: false
    },
    showPassword: false
  };

  constructor(props: Props) {
    super(props);
    props.dispatch(AuthActions.setLoggedIntoFalse());
  }

  handleInputChange = ({ target: { name, value } }) => {
    if (name === "identifier") {
      this.setState({
        identifier: value,
        errors: {
          email: false
        }
      });
    } else
      this.setState({
        password: value,
        errors: {
          password: false
        }
      });
  };

  onSubmit = (e: { preventDefault: () => void }) => {
    const { next, showSnackBar } = this.props;
    // showSnackBar(' logging in', 20000)
    // return
    e.preventDefault();
    this.props.dispatch(
      AuthActions.login(this.state.identifier, this.state.password, () => {
        showSnackBar('successfully logged in, redirecting in a bit')
        setTimeout(() => {
          redirectTo(next);
        }, 500);
      })
    );
  };

  render() {
    const {
      classes,
      errors: { password, email },
      message,
      loading
    } = this.props;
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
          <form className={classes.form} onSubmit={this.onSubmit} noValidate>
            <FormControl margin="normal" required fullWidth>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="identifier"
                error={email ? true : false}
                label="Email or Phone"
                name="identifier"
                onChange={this.handleInputChange}
                autoComplete="email"
                autoFocus
                value={this.state.identifier}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
              />
              {email ? (
                <FormHelperText error id="component-error-text">
                  {email}
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
                error={password ? true : false}
                autoComplete="current-password"
                onChange={this.handleInputChange}
                value={this.state.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpen />
                    </InputAdornment>
                  )
                }}
              />
              {password ? (
                <FormHelperText error id="component-error-text">
                  {password}
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
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }
}

function mapStateToProps({ auth: { errors, loggedIn, loading } }) {
  return {
    errors: {
      password: errors.passwordError,
      email: errors.identifierError
    },
    loggedIn,
    loading
  };
}

export default connect(mapStateToProps)(withStyles(styles)(LoginPage));
