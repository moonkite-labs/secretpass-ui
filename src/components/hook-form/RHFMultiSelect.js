import React from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Select, Checkbox, MenuItem, InputLabel, FormControl, FormHelperText, ListItemText, Input } from '@mui/material';

RHFMultiSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array, 
  helperText: PropTypes.node,
  sx: PropTypes.object,
  variant: PropTypes.string,
  selectedValues: PropTypes.array,
  setSelectedValues: PropTypes.func
};
export function RHFMultiSelect({ name, label, options, helperText, sx, selectedValues, setSelectedValues, ...other }) {
  const { control } = useFormContext();

  // const renderValues = (selectedIds) => {
  //   const selectedItems = options.filter((item) => selectedIds.includes(item.value));

  //   if (!selectedItems.length && placeholder) {
  //     return (
  //       <Box component="em" sx={{ color: 'text.disabled' }}>
  //         {placeholder}
  //       </Box>
  //     );
  //   }

  //   if (chip) {
  //     return (
  //       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
  //         {selectedItems.map((item) => (
  //           <Chip key={item.value} size="small" label={item.label} />
  //         ))}
  //       </Box>
  //     );
  //   }

  //   return selectedItems.map((item) => item.label).join(', ');
  // };
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 280,
        width: 250
      }
    }
  };

  // const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={sx}>
          {label && <InputLabel id={name}> {label} </InputLabel>}
          <Select
            {...field}
            multiple
            labelId={name}
            value={selectedValues}
            input={<Input fullWidth label={label} error={!!error} variant="standard" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            onChange={handleChange}
            {...other}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={selectedValues.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>

          {(!!error || helperText) && <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
