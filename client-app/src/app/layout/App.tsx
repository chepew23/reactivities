import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import NavBar from './NavBar';

function App() {
  return (
    <Fragment>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
      </Container>
    </Fragment>
  );
}

export default App;
