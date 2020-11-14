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
import { SignUpCredentials } from '../../../interfaces';
import { PASSWORD_REG_EXP } from '../../../utils/constants';

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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUpPage: React.FC = () => {
  const classes = useStyles();

  const validationSchema = yup.object().shape({
    name: yup.string().trim().min(2).max(50).required(),
    email: yup.string().trim().max(50).email().required(),
    password: yup
      .string()
      .test({
        name: 'password-validation',
        test: (value: any) => PASSWORD_REG_EXP.test(value),
        message:
          'password should contain at least one Uppercase symbol and one digit',
        exclusive: true,
      })
      .min(8)
      .max(50)
      .required(),
  });

  const initialValues: SignUpCredentials = {
    email: '',
    password: '',
    name: '',
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
    onSubmit: () => {},
  });

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                fullWidth
                id="sign-up-form-name"
                label="Name"
                autoFocus
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                error={!!(touched.name && errors.name)}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="sign-up-form-email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                error={!!(touched.email && errors.email)}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="sign-up-form-password"
                autoComplete="current-password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                error={!!(touched.password && errors.password)}
                helperText={errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login">
                <Typography variant="body2">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Typography variant="body2" color="textSecondary" align="center">
          Copyright © Personal Manger {new Date().getFullYear()}.
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUpPage;
