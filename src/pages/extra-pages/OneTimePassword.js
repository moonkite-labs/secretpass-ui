// material-ui
import { Typography, Stack, FormHelperText, Box } from '@mui/material';
import FormProvider, { RHFCodes } from '../../components/hook-form';
// import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// ==============================|| SAMPLE PAGE ||============================== //

const FilePage = () => {
  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    code5: Yup.string().required('Code is required'),
    code6: Yup.string().required('Code is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: ''
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues
  });

  const {
    handleSubmit,
    formState: { errors }
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('DATA:', {
        email: data.email,
        code: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
        password: data.password
      });
      sessionStorage.removeItem('email-recovery');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '750px'
      }}
    >
      <Typography variant="h3" paragraph>
        Enter 6 digit PIN
      </Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFCodes keyName="code" inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']} />

          {(!!errors.code1 || !!errors.code2 || !!errors.code3 || !!errors.code4 || !!errors.code5 || !!errors.code6) && (
            <FormHelperText error sx={{ px: 2 }}>
              Code is required
            </FormHelperText>
          )}

          {/* <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
            Update Password
          </LoadingButton> */}
        </Stack>
      </FormProvider>
      {/* <Typography variant="body2" sx={{ my: 3 }}>
        Don’t have a code? &nbsp;
        <Link variant="subtitle2">Resend code</Link>
      </Typography> */}
    </Box>
  );
};

export default FilePage;
