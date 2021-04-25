import React, { Component } from 'react';
import { Nav, Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, DropdownToggle, DropdownMenu, Dropdown, UncontrolledDropdown, DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faUtensils } from '@fortawesome/free-solid-svg-icons';
import SelectedItem from './Management/MenuItem/selectedItem';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            loggedIn: localStorage.getItem('loggedIn') === 'true',
            type: (localStorage.getItem('type') == 'user' || localStorage.getItem('type') == 'admin' || localStorage.getItem('type') == 'waiter') ? localStorage.getItem('type').toString() : 'guest',
        };
    }
    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <>
                <Navbar id="nav" color="dark" className="shadow-custom" sticky="top" expand="sm" dark>
                    <Container>
                        <NavbarBrand className="text-white" tag={Link} to="/">Click&Eat</NavbarBrand>

                        <NavbarToggler onClick={this.toggleNavbar} className="mr-0 ml-auto" />
                        <Collapse isOpen={!this.state.collapsed} navbar>
                            <Nav className="mr-0 ml-auto" navbar>
                                <NavItem>
                                    <Link tag={Link} className="nav-link text-white" to="/">Home</Link>
                                </NavItem>
                                {(this.state.type == 'admin' || this.state.type == 'waiter') && (<>
                                    <NavItem>
                                        <Link tag={Link} className="nav-link text-white" to="/Analytics">Analytics</Link>
                                    </NavItem>
                                    {
                                        this.state.type == 'admin' &&
                                        <UncontrolledDropdown nav>
                                            <DropdownToggle className="text-white" nav caret>
                                                Accounts
                                                </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>
                                                    <Link tag={Link} className="nav-link text-dark" to="/waiters">Waiters</Link>
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <Link tag={Link} className="nav-link text-dark" to="/customers">Customers</Link>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    }
                                    <div>
                                        {this.state.type == 'admin' &&

                                            <UncontrolledDropdown nav>
                                                <DropdownToggle className="text-white" nav caret>
                                                    Management
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem>
                                                        <Link className="text-dark nav-link" to="/category">Menu Category</Link>
                                                    </DropdownItem>
                                                    <DropdownItem>
                                                        <Link className="text-dark nav-link" to="/menuItems">Menu Item</Link>
                                                    </DropdownItem>
                                                    <DropdownItem>
                                                        <Link className=" text-dark nav-link" to="/orders">Orders</Link>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        }
                                        {
                                            this.state.type == 'waiter' &&
                                            <Link className=" nav-link text-white" to="/orders">Orders</Link>
                                        }
                                    </div>
                                </>)
                                }
                                {!this.state.loggedIn && (
                                    <>

                                        < NavItem >
                                            <Link tag={Link} className="nav-link text-white" to="/signup">Register</Link>
                                        </NavItem>
                                        < NavItem >
                                            <Link tag={Link} className="nav-link text-white" to="/signin">Login</Link>
                                        </NavItem>

                                    </>
                                )}
                                {this.state.loggedIn &&
                                    <UncontrolledDropdown nav>
                                        <DropdownToggle className="text-white" nav caret>
                                            My Account
                                                </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem >
                                                <Link tag={Link} className="nav-link text-dark" to="/changePassword">Change Password</Link>
                                            </DropdownItem>
                                            <DropdownItem >
                                                <Link tag={Link} className="nav-link text-dark" to="/signout">Logout</Link>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                }
                            </Nav>
                        </Collapse>
                        {!(this.state.type == 'admin' || this.state.type == 'waiter') && <span >
                            <UncontrolledDropdown  >
                                <DropdownToggle className="text-white pl-1 " nav caret>
                                    My Orders <span className="badge text-purple bg-light badge-pill border small badge-light" >{localStorage.getItem('dishItemCount') != undefined ? localStorage.getItem('dishItemCount') : 0}
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <Link tag={Link} to='/dish' className="text-purple nav-link font-weight-bold" >
                                            <FontAwesomeIcon className="text-purple" /*icon={faUtensils} size={"lg"}*/ /> Selected Items <span className="badge text-white bg-dark badge-pill border small badge-light" >{localStorage.getItem('dishItemCount') != undefined ? localStorage.getItem('dishItemCount') : 0}
                                            </span>
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <Link tag={Link} to='/orderHistory' className="text-purple nav-link font-weight-bold" >
                                            <FontAwesomeIcon className="text-purple" /*icon={faHistory} size={"lg"}*/ /> Previous Orders
                                            {localStorage.getItem("pendingPayment") != null &&
                                                <>{" "}
                                                    <span className="badge text-white badge-pill text-white bg-dark border small badge-light" >{"Due"}</span>
                                                </>
                                            }
                                        </Link>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </span>
                        }

                    </Container>
                </Navbar>
            </>
        );
    }
}
