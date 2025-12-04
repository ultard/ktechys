import React, { useState, useEffect, useRef } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const DebounceInput = ({
  value: propValue,
  onChange,
  onDebounceStart,
  onDebounceEnd,
  debounceTimeout = 500,
  showClearButton = true,
  showSearchIcon = true,
  minLength = 0,
  ...textFieldProps
}) => {
  const [internalValue, setInternalValue] = useState(propValue || '');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!isInitialMount.current) {
      setInternalValue(propValue || '');
    }
  }, [propValue]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (internalValue === propValue) {
      return;
    }

    if (internalValue.length < minLength && internalValue.length > 0) {
      return;
    }

    setIsDebouncing(true);
    onDebounceStart?.();

    const timerId = setTimeout(() => {
      onChange(internalValue);
      setIsDebouncing(false);
      onDebounceEnd?.();
    }, debounceTimeout);

    return () => clearTimeout(timerId);
  }, [
    internalValue,
    debounceTimeout,
    onChange,
    propValue,
    minLength,
    onDebounceStart,
    onDebounceEnd
  ]);

  const handleChange = (event) => {
    setInternalValue(event.target.value);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <TextField
      value={internalValue}
      onChange={handleChange}
      InputProps={{
        startAdornment: showSearchIcon && (
          <InputAdornment position="start">
            <SearchIcon color={isDebouncing ? 'primary' : 'action'} />
          </InputAdornment>
        ),
        endAdornment: showClearButton && internalValue && (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear input"
              onClick={handleClear}
              edge="end"
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
      helperText={
        isDebouncing
          ? 'Идет поиск...'
          : internalValue.length < minLength && internalValue.length > 0
            ? `Минимальная длина: ${minLength} символов`
            : textFieldProps.helperText
      }
      {...textFieldProps}
    />
  );
};

export default DebounceInput;
