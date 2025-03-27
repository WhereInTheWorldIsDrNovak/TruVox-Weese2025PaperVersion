import {Row, Col, Tooltip, Input} from 'antd';
import React, {useEffect, useState} from 'react';
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import GenericInput from './GenericInput';
import {Validation} from '../types/configTypes';

interface ValidatedInputField {
  name: string;
  placeholder: string;
  validations: Validation[];
  theme: string;
  isPassword?: boolean | undefined;
  hasTooltip?: boolean | undefined;
  overrideStatus?: boolean | undefined;
  overrideVisualStatus?: 'error' | 'warning' | null | undefined;
  globalSetIsValid?: ((b: boolean) => void) | undefined;
  globalSetErrMessage?: ((s: string) => void) | undefined;
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
  onPressEnter?: ((e: React.FormEvent) => void) | undefined;
  className?: string | undefined;
  style?: any;
}

/**
 * Creates a text input field that is validated against specified requirements
 *
 * @param name The internal name of the field.
 * @param placeholder The name that will be displayed in the text box when it is empty.
 * @param validations An array of the validations to apply to the input field.
 * @param theme The current site theme.
 *
 * @param isPassword Whether or not the field is a password input and therefore should hide its contents (default to false).
 * @param hasTooltip Whether or not the field has a tooltip to display its requirements (default to false).
 * @param overrideStatus An optional parameter to override the status of the input. (true makes it valid, false makes it invalid, undefined lets the component decide)
 * @param overrideVisualStatus An optional parameter to override the visual status of the input field to the user.
 * @param globalSetIsValid An optional parameter to pass in a global function that sets whether or not this input is valid. Will run this to match internal isValid
 * @param onChange An optional parameter. Whatever function is passed in here will run whenever the input value is changed.
 * @param onPressEnter An optional parameter. A callback function that runs when the user presses enter while focused on this input field.
 * @param className An optional parameter. If passed, this will be the className of the antd input component.
 * @param style An optional parameter. Will override the style of the input field.
 */
const ValidatedInputField: React.FC<ValidatedInputField> = ({
  name,
  placeholder,
  validations,
  theme,

  isPassword = false,
  hasTooltip = false,
  overrideStatus = undefined,
  overrideVisualStatus = undefined,
  globalSetIsValid = undefined,
  globalSetErrMessage = undefined, // Currently unused but keeping for possible future implementation
  onChange = undefined,
  onPressEnter = undefined,
  className = undefined,
  style = undefined,
}) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [showErrMessage, setShowErrMessage] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [reqsMet, setReqsMet] = useState<boolean[]>([]);

  const [innerTooltip, setInnerTooltip] = useState<React.JSX.Element[]>([]);

  // Sets the length of reqsMet to match validations length
  useEffect(() => {
    const reqsMetLocal: boolean[] = [];
    for (let i = 0; i < validations.length; i++) {
      reqsMetLocal.push(false);
    }
    setReqsMet(reqsMetLocal);
  }, []);

  // Sets up the initial innerTooltip
  useEffect(() => {
    if (!hasTooltip) {
      return;
    }

    const innerTooltipLocal: React.JSX.Element[] = [];
    for (let i = 0; i < validations.length; i++) {
      innerTooltipLocal.push(
        <dl className="list-item-error">{validations[i].tooltipDesc}</dl>
      );
    }
    setInnerTooltip(innerTooltipLocal);
  }, []);

  // Sets all the innerTooltip classNames to the corrent values
  // Also if all reqsMet are true, sets isValid to true
  useEffect(() => {
    const innerTooltipLocal: React.JSX.Element[] = [];
    for (let i = 0; i < reqsMet.length; i++) {
      if (reqsMet[i]) {
        innerTooltipLocal.push(
          <dl className="list-item-success">{validations[i].tooltipDesc}</dl> // This is assuming that reqsMet, validations, and innerTooltip are all the same length, which they should be because they are all based on validations.length
        );
      } else {
        innerTooltipLocal.push(
          <dl className="list-item-error">{validations[i].tooltipDesc}</dl>
        );
      }
    }

    setInnerTooltip(innerTooltipLocal);

    setIsValid(false);
    for (let i = 0; i < reqsMet.length; i++) {
      if (!reqsMet[i]) {
        return;
      }
    }
    setIsValid(true);
  }, [reqsMet]);

  // Updates userData, also checks if all validation requirements are complete, updating reqsMet
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userIn = e.target.value;
    const reqsMetLocal: boolean[] = [];

    for (let i = 0; i < validations.length; i++) {
      const curVal = validations[i];
      switch (curVal.type) {
        case 'regex_match':
          if (curVal.argument instanceof RegExp) {
            reqsMetLocal.push(!!userIn.match(curVal.argument));
          }
          break;
        case 'regex_test':
          if (curVal.argument instanceof RegExp) {
            reqsMetLocal.push(!!curVal.argument.test(userIn));
          }
          break;
        case 'string_includes':
          if (
            Array.isArray(curVal.argument) &&
            typeof curVal.argument[0] === 'string'
          ) {
            let temp = false;
            for (let j = 0; j < curVal.argument.length; j++) {
              if (userIn.includes(curVal.argument[j])) {
                temp = true;
                break;
              }
            }

            reqsMetLocal.push(temp);
          } else if (typeof curVal.argument === 'string') {
            reqsMetLocal.push(userIn.includes(curVal.argument));
          }
          break;
        case 'string_match':
          if (typeof curVal.argument === 'string') {
            reqsMetLocal.push(userIn === curVal.argument);
          } else if (
            Array.isArray(curVal.argument) &&
            typeof curVal.argument[0] === 'string'
          ) {
            let temp = false;
            for (let j = 0; j < curVal.argument.length; j++) {
              if (userIn === curVal.argument[j]) {
                temp = true;
                break;
              }
            }

            reqsMetLocal.push(temp);
          }
          break;
        case 'length':
          if (typeof curVal.argument === 'number') {
            reqsMetLocal.push(userIn.length >= curVal.argument);
          }
          break;
        default:
          // Should never get here
          break;
      }
    }

    setReqsMet(reqsMetLocal);

    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (typeof overrideStatus === 'undefined') {
      return;
    }

    const reqsMetLocal: boolean[] = [];
    for (let i = 0; i < validations.length; i++) {
      reqsMetLocal.push(overrideStatus);
    }
    setReqsMet(reqsMetLocal);
  }, [overrideStatus]);

  useEffect(() => {
    if (globalSetIsValid) {
      globalSetIsValid(isValid);
    }
  }, [isValid]);

  return (
    <div>
      <Tooltip
        title={hasTooltip ? <dd> {innerTooltip} </dd> : null}
        placement="left"
        trigger={'focus'}
      >
        <GenericInput
          isPassword={isPassword}
          size="large"
          name={name}
          placeholder={placeholder}
          variant={theme === 'dark' ? 'outlined' : 'filled'}
          status={
            typeof overrideVisualStatus !== 'undefined'
              ? overrideVisualStatus
              : isValid
                ? ''
                : 'error'
          }
          iconRender={visible =>
            isPassword ? (
              visible ? (
                <EyeTwoTone />
              ) : (
                <EyeInvisibleOutlined />
              )
            ) : (
              ''
            )
          }
          style={typeof style !== 'undefined' ? style : {width: '35vw'}}
          onChange={handleInputChange}
          className={className}
          onPressEnter={onPressEnter}
        />
      </Tooltip>
      {showErrMessage && (
        <p
          style={{
            color: '#ffa39e',
            fontSize: 'calc(9px + 0.25vw)',
            marginTop: 0,
          }}
        >
          {errMessage}
        </p>
      )}
    </div>
  );
};

export default ValidatedInputField;
