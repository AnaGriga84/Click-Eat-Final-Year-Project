import { Alert } from 'reactstrap';
import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';

export class Layout extends Component {
    static displayName = Layout.name;

  render () {
    return (
        <div>            
            <NavMenu />
            <Container >                
          {this.props.children}
        </Container>
      </div>
    );
  }
}
