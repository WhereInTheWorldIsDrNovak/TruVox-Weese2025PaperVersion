import {Radio, RadioChangeEvent, Space, Switch, Tooltip} from 'antd';

interface RadioItem {
  value: string;
  name: string;
  label: string | undefined | null;
}

interface RadioSettingProps {
  title: string;
  onChange: ({target: {value}}: RadioChangeEvent) => void;
  value: string;
  defaultValue: string;
  items: RadioItem[];
}

const RadioSetting: React.FC<RadioSettingProps> = ({
  title,
  onChange,
  value,
  defaultValue,
  items,
  ...props
}) => {
  return (
    <Space direction="horizontal">
      <p>{title}</p>
      <Radio.Group
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        buttonStyle="solid"
        style={{display: 'flex', gap: '0px'}}
        {...props}
      >
        {items.map(option => (
          <Tooltip placement="top" title={option.label}>
            <Radio.Button value={option.value} key={option.value}>
              {option.name}
            </Radio.Button>
          </Tooltip>
        ))}
      </Radio.Group>
      <br />
    </Space>
  );
};

interface SwitchSettingProps {
  title: string;
  tooltip: string | undefined;
  defaultChecked: boolean;
  value: boolean;
  onChange: (bool: boolean) => void;
}

const SwitchSetting: React.FC<SwitchSettingProps> = ({
  title,
  tooltip,
  defaultChecked,
  value,
  onChange,
  ...props
}) => {
  return (
    <Space>
      <p>{title}</p>
      <Tooltip title={tooltip}>
        <Switch
          defaultChecked={defaultChecked}
          value={value}
          onChange={onChange}
          {...props}
        />
      </Tooltip>
    </Space>
  );
};

export {RadioSetting, SwitchSetting};
