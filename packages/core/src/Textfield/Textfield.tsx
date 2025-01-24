import { forwardRef, useRef } from 'react';
import { TextfieldPropsBase } from './Textfield.types';
import { useTheme } from '@spark-ui/system';
import { TextfieldStyles } from './Textfield.styles';
import { useTextField } from './useTextfield';
import { InputBase } from '../InputBase';
import { useForkRef } from './useForkRef';

const Textfield = forwardRef<HTMLInputElement, TextfieldPropsBase>((props, ref) => {
  const {
    label,
    placeholder,
    disabled,
    error,
    prepend,
    append,
    value,
    onChange,
    onFocus,
    onBlur,
    inputSize = 'medium',
    helperText,
    containerStyle,
    isCurrency,
    type,
    ...rest
  } = props;

  const { theme } = useTheme();
  const {
    value: fieldValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    focused,
    disabled: isDisabled,
    error: hasError,
  } = useTextField({
    value,
    onChange,
    onFocus,
    onBlur,
    disabled,
    error,
    type
  });

  const styles = TextfieldStyles({
    theme,
    focused,
    disabled: isDisabled,
    hasError,
    size: inputSize
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(ref, inputRef);

  const handleTextfieldFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      css={styles.baseStyles}
      onClick={handleTextfieldFocus}
    >
      {label && (
        <label
          css={styles.labelStyles}
          onClick={handleTextfieldFocus}
        >
          {label}
        </label>
      )}
      <div css={styles.inputContainer} style={{...containerStyle}}>
        {prepend && <div css={styles.prependStyles}>{prepend}</div>}
        <InputBase
          ref={handleRef}
          css={styles.inputStyles}
          placeholder={placeholder}
          disabled={isDisabled}
          value={fieldValue}
          variant='outlined'
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {append && <div css={styles.appendStyles}>{append}</div>}
      </div>
      {helperText && (
        <p css={styles.helperTextStyles}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Textfield.displayName = 'TextField';

export default Textfield;