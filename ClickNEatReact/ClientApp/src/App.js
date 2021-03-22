import React, { Component } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './custom.css'
import { SignIn } from './components/SiginIn';
import { AuthContext } from './context/auth';
import PrivateRoute from './_component/PrivateRoute';
import Dashboard from './components/Management/Analytics';
import Category from './components/Management/Category/Category';
import MenuItem from './components/Management/MenuItem/MenuItems';
import Waiter from './components/Admin/waiter';
import Orders from './components/Management/Order/Order';
import SelectedItem from './components/Management/MenuItem/selectedItem';
import '../src/Assets/fontawesome/css/all.css';
import OrderHistory from './components/Management/Order/OrderHistory';
import SignUp from './components/SignUp';
import Analytics from './components/Management/Analytics';

export default class App extends Component {
    static displayName = App.name;
    constructor(props) {
        super(props);
        this.state = {
            type: (localStorage.getItem('type') == 'user' || localStorage.getItem('type') == 'admin') ? localStorage.getItem('type').toString() : 'guest',
            loggedin: localStorage.getItem('loggedIn') === 'true',
            count: 0,
        }
        this.setType = this.setType.bind(this);
        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.selectMenuItem = this.selectMenuItem.bind(this);
        this.updateThis = this.updateThis.bind(this);
    }

    componentDidMount() {
        this.setType(localStorage.getItem('type'));
        this.setLoggedIn(localStorage.getItem('loggedIn'));
        let count = localStorage.getItem('dishItemCount') != undefined ? localStorage.getItem('dishItemCount') : 0;
        this.setState({ count: parseInt(count) });
       // window.addEventListener("resize", () => window.location.reload(false));
    }
    componentWillUnmount() {
        window.removeEventListener('resize', () => window.location.reload(false));
    }

    async setType(type) {
        await this.setState({ type: type });
        //alert(this.state.type.toString());
    }
    async setLoggedIn(val) {
        await this.setState({ loggedin: val });
        //alert(this.state.loggedin.toString());
    }

    selectMenuItem(menu) {
        localStorage.setItem('dishItemCount', this.state.count + 1);
        this.setState({ count: this.state.count + 1 });
    }
    updateThis() {
        this.forceUpdate();
    }






    render() {

        const SignOut = () => {
            localStorage.removeItem('username')
            localStorage.removeItem('type');
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
            
            return (
                <div>
                    Signing Out...
                    {
                        window.location.href = '/'
                    }
                </div>
                )

        }
        
        return (

            <Layout>
                
                <AuthContext.Provider value={(this.state.type == 'admin' && this.state.loggedin)}>

                    <Switch>
                        <Route exact path='/'><Home selectMenuItem={this.selectMenuItem} /></Route>
                        <Route exact path='/signin' setType={this.setType} ><SignIn setType={this.setType} setLoggedIn={this.setLoggedIn} /></Route>
                        <Route exact path='/signup'  ><SignUp /></Route>
                        <Route exact path='/signout' component={SignOut} />
                        <Route exact path='/dish'  ><SelectedItem updateThis={this.updateThis} /> </Route>
                        <Route exact path='/orderHistory'  ><OrderHistory /> </Route>
                        <PrivateRoute exact path='/category' component={Category} />
                        <PrivateRoute exact path='/menuItems' component={MenuItem} />
                        <PrivateRoute exact path='/waiters' component={Waiter} />
                    </Switch>
                </AuthContext.Provider>
                <AuthContext.Provider value={((this.state.type == 'admin' || this.state.type == 'waiter') && this.state.loggedin)}>
                    <Switch>
                        <PrivateRoute exact path='/orders' component={Orders} />
                        <PrivateRoute exact path='/analytics' component={Analytics} />
                    </Switch>
                </AuthContext.Provider>
                    
            </Layout>

        );
    }
}
