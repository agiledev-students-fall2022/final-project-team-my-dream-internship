import { useState, useEffect } from "react";
import { Container } from "@mui/system";
import {
  Avatar,
  Card,
  CardHeader,
  Typography,
  IconButton,
  CssBaseline,
  AppBar,
  Toolbar,
  CircularProgress,
  Grid,
  CardActionArea,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import useStyles from "./InternshipsStyles";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";

export default function Internships() {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [internships, setInternships] = useState([]);

  const fetchInternships = () => {
    // setMessages([])
    // setLoaded(false)
    axios
      .get("http://localhost:5002/get_internships")
      .then((response) => {
        // axios bundles up all response data in response.data property
        const internships = response.data;
        setInternships(internships);
      })
      .catch((err) => {
        // catching error
      })
      .finally(() => {
        // the response has been received, so remove the loading icon
        setLoaded(true);
      });
  };

  // set up loading data from api when the component first loads
  useEffect(() => {
    // fetch messages this once
    fetchInternships();
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Link to="/dash">
            <IconButton>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h4">Internships</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div>
          {!loaded && <CenteredLoader />}
          <Container maxWidth="md" className={classes.cardGrid}>
            {internships.map((internship) => (
              <InternshipCell internship={internship} key={internship.id} />
            ))}
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InternshipCell({ internship }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea disableRipple>
        <CardHeader
          avatar={
            <Avatar
              src={
                internship.companyLogo !== ""
                  ? internship.companyLogo
                  : "https://source.unsplash.com/random/"
              }
            />
          }
          action={
            <Link
              to={internship.id.toString()}
              state={{ selectedInternship: internship }}
            >
              <IconButton>
                <ArrowForward />
              </IconButton>
            </Link>
          }
          title={internship.positionName}
          subheader={internship.companyName}
        />
      </CardActionArea>
    </Card>
  );
}

function CenteredLoader() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <CircularProgress size={100} />
      </Grid>
    </Grid>
  );
}
