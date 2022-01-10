import { Switch, BrowserRouter, Route, Link } from 'react-router-dom';
import Home from '../views/home';
import Icon from '../views/Icon';
import Button from '../views/Button';
import Badge from '../views/Badge';
import Switcher from '../views/Switch';
import Radio from '../views/Radio';

export default function App(): any {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/icon" exact>
          <Icon />
        </Route>
        <Route path="/button" exact>
          <Button />
        </Route>
        <Route path="/badge" exact>
          <Badge />
        </Route>
        <Route path="/switch" exact>
          <Switcher />
        </Route>
        <Route path="/radio">
          <Radio />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
