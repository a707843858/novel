import Style from './style/bowser.scss';
import { defindComponent } from './utils/utils';
import { Button } from './button';
import { Icon } from './icon';
import { Badge } from './badge';
import { Link } from './link';
import { Switch } from './switch';

export interface useProps {
  components?: { [k: string]: any };
}
const components: { [k: string]: any } = { Switch, Button, Icon, Badge }; //,  Link

export const version = '1.0';

export const use = function (props: useProps = {}) {
  //Add global style
  if (document) {
    const style = document.createElement('style');
    style.innerHTML = Style ? Style.toString() : '';
    document.getElementsByTagName('head')?.item(0)?.appendChild(style);
  }
  //Register component
  if (
    !props.components ||
    Object.getOwnPropertyNames(props.components).length == 0
  ) {
    for (let key in components) {
      let name = key.toLowerCase();
      defindComponent(name, components[key]);
    }
  } else {
    const len = props.components.length || 0;
    for (let i = 0; i < len; i++) {
      let key = props.components[i];
      let name = key.toLowerCase();
      defindComponent(name, components[key]);
    }
  }
};

export default {
  use,
  version,
};
