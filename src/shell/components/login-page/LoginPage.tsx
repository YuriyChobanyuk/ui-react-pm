import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoginCredentials } from '../../../interfaces';
import { authActions } from '../../ducks';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginPage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLogin = (loginCredentials: LoginCredentials) => {
    dispatch(authActions.login(loginCredentials));
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const initialValues: LoginCredentials = {
    email: '',
    password: '',
  };

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
  } = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (userValues) => {
      handleLogin(userValues);
    },
    validateOnMount: false,
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="login-form-email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
            error={!!(touched.email && errors.email)}
            helperText={errors.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="login-form-password"
            autoComplete="current-password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            error={!!(touched.password && errors.password)}
            helperText={errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/login">
                <Typography variant="body2">Forgot password? (todo)</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup">
                <Typography variant="body2">
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          Copyright © Personal Manger {new Date().getFullYear()}.
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
