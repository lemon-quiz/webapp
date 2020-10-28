import {Container, Grid, Paper} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  paper: {
    padding: '20px'
  }
}))

export default function CenteredBox({children}: { children: React.ReactNode }) {
  const styles = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Grid container
            spacing={0}
            direction="row"
            justify="center"
            alignItems="center"
            style={{minHeight: '60vh'}}
      >
        <Grid item xs={12}>
          <Paper elevation={3} className={styles.paper}>
            <Grid container
                  justify="center"
                  alignItems="center">
              {children}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
