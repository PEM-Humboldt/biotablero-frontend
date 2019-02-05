import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 300,
    height: 330,
  },
  icon: {
    color: 'rgba(255, 130, 157, 0.84)',
  },
  card: {
    width: 290,
    hover: { color: 'tomato' },
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const CardManager = ({
  thumbnailsData, classes,
}) => (
  <div>
    <GridList cellHeight={0} className={classes.gridList}>
      <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardContent>
              <h1>
                Porcentaje de cobertura boscosa
              </h1>
              <h2>
                Forest area as a percentage of total land area (proposed
                 indictor for SDG target 15.1)
              </h2>
              <h3>
                1990 - 2014
              </h3>
                (Tag 1)
              <br />
              {'"(Tag 2)"'}
            </CardContent>
          </CardActionArea>
        </Card>
      </GridListTile>
    </GridList>
  </div>
);

CardManager.propTypes = {
  thumbnailsData: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardManager);
