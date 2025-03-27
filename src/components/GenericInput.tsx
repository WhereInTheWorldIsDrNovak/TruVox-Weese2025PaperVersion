import {Input} from 'antd';
import React from 'react';

interface GenericInputProps {
  isPassword?: boolean;
}

/**
 * Simply either returns an Input or an Input.Password element with the given props
 *
 * @param isPassword Whether or not the field is a password input and therefore should hide its contents (default to false).
 */
const GenericInput = ({isPassword = false, ...props}: any) => {
  if (isPassword) {
    return <Input.Password {...props} />;
  } else {
    return <Input {...props} />;
  }
};

export default GenericInput;
