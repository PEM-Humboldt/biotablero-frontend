import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

const CardManager = ({
  thumbnailsData, classes,
}) => (
  <Card className={classes.card}>
    <CardContent>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        Porcentaje de cobertura boscosa
      </Typography>
      <Typography variant="h5" component="h2">
        Forest area as a percentage of total land area (proposed indictor for SDG target 15.1)
      </Typography>
      <Typography className={classes.pos} color="textSecondary">
        1990 - 2014
      </Typography>
      <Typography component="p">
        (Tag 1)
        <br />
        {'"(Tag 2)"'}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">{thumbnailsData}</Button>
    </CardActions>
  </Card>

);

CardManager.propTypes = {
  thumbnailsData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardManager);
