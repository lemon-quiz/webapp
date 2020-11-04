import React, {ReactElement, ReactNode} from "react";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";

export interface PendingInterface {
  loading: boolean;
  children: ReactNode
}

const useStyles = makeStyles((_theme: Theme) => ({
  pendingWrapper: {
    position: 'relative'
  },

  pendingLayer: {
    position:'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: grey.A400,
    opacity: '0.1'
  }

}));

export default function Pending({loading, children}: PendingInterface): ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.pendingWrapper}>
      {loading && <div className={styles.pendingLayer}/>}
      {children}
    </div>
  );
}
