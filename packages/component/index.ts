import Style from './style/bowser.scss';
import { camelCaseToHyphen } from './utils/utils';
import { register } from '@/core';
import { Button } from './button';
import { Icon } from './icon';
import { Badge } from './badge';
import { Link } from './link';
import { Switch } from './switch';
import { Radio } from './radio';
import { RadioGroup } from './radio-group';

export interface useProps {
  components?: { [k: string]: any };
}

const componentTag: string[] = [
    'Switch',
    'Button',
    'Icon',
    'Badge',
    'Radio',
    'RadioGroup',
  ],
  components: { [k: string]: any } = {
    Switch,
    Button,
    Icon,
    Badge,
    Radio,
    RadioGroup,
  }; //,  Link

export const version = '1.0';

export const use = function (props: useProps = {}) {
  //Add global style
  if (document) {
    const style = document.createElement('style');
    style.innerHTML = Style ? Style.toString() : '';
    document.getElementsByTagName('head')?.item(0)?.appendChild(style);
  }
  //Register component
  const componentNams = props.components || Object.keys(components);
  componentNams.forEach((key: string) => {
    let elCont = components[key];
    key = 'n-' + camelCaseToHyphen(key);
    register(key, elCont);
  });
};

export default {
  use,
  version,
};
