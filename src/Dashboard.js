import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./../node_modules/bulma/css/bulma.min.css";
import PropTypes from "prop-types";
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import DescriptionIcon from '@material-ui/icons/Description';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ClientsPage from "./pages/ClientsPage";
import DocumentsPage from "./pages/DocumentsPage";
import TransactionsPage from "./pages/TransactionsPage";
import SeatsPage from "./pages/SeatsPage";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  title: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Dashboard(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const routes = [
    {name: "Home", path: "/", icon: <HomeIcon />},
    {name: "Clients", path: "/clients", icon: <AssignmentIndIcon />},
    {name: "Documents", path: "/documents", icon: <DescriptionIcon />},
    {name: "Transactions", path: "/transactions", icon: <AttachMoneyIcon />},
    {name: "Seats", path: "/seats", icon: <AssignmentIcon />},
  ]

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {routes.map((route, index) => (
          <ListItem component={Link} to={route.path} button key={index}>
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText primary={route.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <Router>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            Cuentas por cobrar
          </Typography>
          {props.children}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/">
            <h1 className="is-size-1">Home page</h1>
          </Route>
            <Route exact path="/clients">
              <ClientsPage />
            </Route>
            <Route exact path="/documents">
              <DocumentsPage />
            </Route>
            <Route exact path="/seats">
              <SeatsPage />
            </Route>
            <Route exact path="/transactions">
              <TransactionsPage />
            </Route>
          </Switch>
      </main>
    </div>
    </Router>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.any,
};

export default Dashboard;