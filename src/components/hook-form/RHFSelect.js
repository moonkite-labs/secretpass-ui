import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
  name: PropTypes.string,
  native: PropTypes.bool,
  children: PropTypes.node,
  helperText: PropTypes.node,
  maxHeight: PropTypes.number,
};

export function RHFSelect({ name, native, children, helperText, maxHeight = 220, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    px: 1,
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                    '& .MuiMenuItem-root': {
                      px: 1,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    },
                  }),
                },
              },
            },
            sx: { textTransform: 'capitalize' },
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
 