import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ControlCamera, People } from '@material-ui/icons';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Link from 'next/link';
import React from 'react';
import { UrlObject } from 'url';

import Access, { ExpectedRoleType } from '../../../core/Access';

interface ListitemLinkInterface {
  expectedRole?: ExpectedRoleType;
  href: string | UrlObject;
  [key: string]: any;
}

function ListItemLink({ href, expectedRole = [], ...rest }: ListitemLinkInterface) {
  return (
    <Access expectedRole={expectedRole}>
      <Link href={href} passHref>
        <ListItem button component="a" {...rest} />
      </Link>
    </Access>
  );
}

export default function SideNav() {
  return (
    <>
      <List>
        <ListItemLink href="/">
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemLink>

        <ListItemLink href="/admin">
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Admin" />
        </ListItemLink>

        <ListItemLink href="/admin/accounts" expectedRole={[{ 'accounts-user': 'read' }]}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItemLink>

        <ListItemLink href="/admin/roles" expectedRole={['accounts-role']}>
          <ListItemIcon>
            <ControlCamera />
          </ListItemIcon>
          <ListItemText primary="Roles" />
        </ListItemLink>

        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon />
                : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon />
                : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </>

  );
}
