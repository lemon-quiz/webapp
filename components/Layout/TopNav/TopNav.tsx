import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Link from "../../../src/Link";
import {Grid} from "@material-ui/core";
import clsx from "clsx";
import {AccountCircle} from "@material-ui/icons";
import AppContext, {AppContextInterface} from "../../Provider/AppContext";
import {useColdOrHot} from "react-miniverse";
import {ProfileInterface} from "../../../module/accounts.module";

const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  hide: {
    display: 'none',
  },
}));

interface TopNavInterface {
  className?: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

export default function TopNav({className, open, setOpen}: TopNavInterface) {
  const classes = useStyles();
  const {storeService, accountsService} = useContext<AppContextInterface>(AppContext);
  const [counter, setCounter] = useState(storeService.getStatic('Misc', 'counter', undefined,20));
  const profile = useColdOrHot<ProfileInterface>(accountsService.profile());

  useEffect(() => {
    const sub = storeService.get('Misc', 'counter', 0).subscribe((record) => {
      setCounter(record.value); });

    return () => {
      sub.unsubscribe();
    }
  }, [])

  const guestMenu = () => (
    <>
      <Grid item>
        <Link href={'/auth/login'} color={'inherit'}
              className={classes.link}>Login</Link>
      </Grid>
      <Grid item>
        <Link href={'/auth/register'} color={'inherit'}
              className={classes.link}>Register</Link>
      </Grid>
    </>
  );

  const authorizedMenu = () => (
    <Grid item>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={'user-menu'}
        aria-haspopup="true"
        color="inherit"
      >
        <AccountCircle/>
      </IconButton>
    </Grid>
  );

  const logout = () => {
    accountsService.logout();
  }

  return (
    <AppBar position="fixed" className={className}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(true)}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          News {counter}
          {profile && profile?.name}
        </Typography>
        <Grid container justify="flex-end" spacing={2} alignItems={'baseline'}>
          {profile?.id ? authorizedMenu() : guestMenu()}
        </Grid>
        <button onClick={logout}>logout</button>
      </Toolbar>
    </AppBar>
  );
}
