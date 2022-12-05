import { useState, useEffect } from "react";
import { Container } from "@mui/system";
import SearchBar from "material-ui-search-bar";
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  CircularProgress,
  Grid,
  CardActionArea,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import useStyles from "./InternshipsStyles";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function Internships() {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [internships, setInternships] = useState([]);




  const searchInternships = (searchTerm) => {
    setLoaded(false);
    if (searchTerm === "") {
      fetchInternships();
    }

    axios
      .post("http://localhost:5002/search_internships", {
        params: {
          searchTerm: searchTerm,
        },
      })
      .then((response) => {
        // axios bundles up all response data in response.data property
        const companies = response.data;
        if (companies.length > 0) {
          setInternships(companies);
        }
        else {
          setInternships([]);

        }
      })
      .catch((err) => {
        // catching error
      })
      .finally(() => {
        // the response has been received, so remove the loading icon
        setLoaded(true);
      });
  };

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
      <NavBar pageTitle="Internships" />
      
      <main>
        <div>
        <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <SearchBar

            placeholder="Search Positions"
            justify="center"
            onRequestSearch={(e) => {
              setLoaded(false);
              searchInternships(e);
            }}
            onCancelSearch={() => fetchInternships()}

            style={{
              margin: "20px",
              maxWidth: 800,
              justifyContent: "center",
            }}
          />
        </Grid>
      </Grid>
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
