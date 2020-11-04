import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import React from "react";
import Link from "next/link";
import {ControlCamera, People} from "@material-ui/icons";

function ListItemLink(props: any) {
  const {href, ...rest} = props;
  return <Link href={href} passHref><ListItem button component={'a'} {...rest} /></Link>;
}

export default function SideNav() {

  return (
    <>
      <List>
        <ListItemLink href="/">
          <ListItemIcon>
            <MailIcon/>
          </ListItemIcon>
          <ListItemText primary={'Home'}/>
        </ListItemLink>

        <ListItemLink href="/admin">
          <ListItemIcon>
            <MailIcon/>
          </ListItemIcon>
          <ListItemText primary={'Admin'}/>
        </ListItemLink>

        <ListItemLink href="/admin/accounts">
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary={'Accounts'}/>
        </ListItemLink>


        <ListItemLink href="/admin/roles">
          <ListItemIcon>
            <ControlCamera />
          </ListItemIcon>
          <ListItemText primary={'Roles'}/>
        </ListItemLink>


        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> :
              <MailIcon/>}</ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
      <Divider/>
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> :
              <MailIcon/>}</ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
    </>

  );
}
