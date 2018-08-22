import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Layouts from './routes/Layout';
import MtCode from './routes/mt_code';
import DropDownCode from './routes/dp_code';
import QRcodeReadCode from './routes/qr_code';
import MapCode from './routes/map_code';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Layouts>
          <Route path="/" exact component={MtCode} />
          <Route path="/mapsearch" exact component={MapCode} />
          <Route path="/dropdownload" exact component={DropDownCode} />
          <Route path="/qrcoderead" exact component={QRcodeReadCode} />
        </Layouts>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
