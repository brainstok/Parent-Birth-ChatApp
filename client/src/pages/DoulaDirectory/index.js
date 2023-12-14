import useDevice from 'src/utils/useDevice';
import Page from 'src/components/common/Page';
import { Container, CardHeader, CardContent, Card, Divider, makeStyles } from '@material-ui/core';
import Doulas from 'src/components/Doulas';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
}));

const DoulaDirectory = () => {
  const classes = useStyles();
  const { isMobile } = useDevice();

  return (
    <Page className={classes.root} title="Doula Directory">
      <Container disableGutters={isMobile && true} maxWidth="md">
        <Card>
          <CardHeader title="Doula Directory" titleTypographyProps={{ variant: 'h4' }} />
          <Divider />
          <CardContent className={classes.cardContent}>
            <Doulas />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default DoulaDirectory;
