import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Stack } from "@mui/system";
import { Link } from "react-router-dom";
import SearchBar from "material-ui-search-bar";
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import {
  Avatar,
  CardActionArea,
  Typography,
  IconButton,
  CssBaseline,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  ToggleButton,
  CardHeader,
} from "@mui/material";
// import { ArrowBack } from "@material-ui/icons";
//import useStyles from "./CompaniesDetailedStyles";
// import { useLocation, useNavigate } from "react-router-dom";
import useStyles from "./CompaniesStyles";
import { Home } from "@material-ui/icons";
import Footer from "./Footer";
import ReadMore from "./ReadMore";
// import { useAuthContext } from "../hooks/useAuthContext";

const lorum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donecin felis pellentesque ante condimentum eleifend vitae laciniaturpis. Mauris imperdiet neque id pellentesque tempor. Uttempor consectetur nibh a malesuada leifend vitae laciniaturpis. Mauris imperdiet neque id pellentesque tempor. Uttempor consectetur nibh a malesuada. Lorem ipsum dolor sitamet, consectetur adipiscing elit. Donec in felis pellentesqueante condimentum eleifend vitae lacinia turpis. Maurisimperdiet neque id pellentesque tempor. Ut tempor consecteturnibh a malesuada leifend vitae lacinia turpis. Maurisimperdiet neque id Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donecin felis pellentesque ante condimentum eleifend vitae laciniaturpis. Mauris imperdiet neque id pellentesque tempor. Uttempor consectetur nibh a malesuada leifend vitae laciniaturpis. Mauris imperdiet neque id pellentesque tempor. Uttempor consectetur nibh a malesuada. Lorem ipsum dolor sitamet, consectetur adipiscing elit. Donec in felis pellentesqueante condimentum eleifend vitae lacinia turpis. Maurisimperdiet neque id pellentesque tempor. Ut tempor consecteturnibh a malesuada leifend vitae lacinia turpis. Maurisimperdiet neque id ";
const card = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const allcompanies = [];


export default function Companies() {
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [noResults, setNoResults] = useState(false);
  // const { user } = useAuthContext();

  const fetchCompanies = () => {
    // setMessages([])
    // setLoaded(false)
    axios
      .get("http://localhost:5002/get_companies")
      .then((response) => {
        // axios bundles up all response data in response.data property
        const companies = response.data;
        setCompanies(companies);
        allcompanies = companies;
      })
      .catch((err) => {
        // catching error
      })
      .finally(() => {
        // the response has been received, so remove the loading icon
        setLoaded(true);
      });
  };


  const searchCompanies = (searchTerm) => {
    setLoaded(false);
    if (searchTerm === "") {
      setCompanies(allcompanies);
    }

    axios
      .post("http://localhost:5002/search_companies", {
        params: {
          searchTerm: searchTerm,
        },
      })
      .then((response) => {
        // axios bundles up all response data in response.data property
        const companies = response.data;
        if (companies.length > 0) {
          setCompanies(companies);
        }
        else {
          setCompanies([]);

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

  // set up loading data from api when the component first loads
  useEffect(() => {
    // fetch messages this once
    fetchCompanies();
    // console.log(user.email);
  }, []);

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Link to="/dash" style={{ flexDirection: "row-reverse" }}>
            <IconButton>
              <Home />
            </IconButton>
          </Link>
          <Typography variant="h6" color="inherit" noWrap>
            MyDreamInternship
          </Typography>
        </Toolbar>
      </AppBar>



      <main>
        <div>
          <Container>
            <Typography
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
              paddingTop="20px"
              paddingBottom="20px"
            >
              Companies
            </Typography>

            <SearchBar
              placeholder="Search Position"
              // onChange={() => setCompanies(allcompanies)}
              onRequestSearch={(e) => {
                setLoaded(false);
                searchCompanies(e);
              }}
              onCancelSearch={() => fetchCompanies()}

              style={{
                margin: "20px",
                maxWidth: 800
              }}
            />
            <Grid container columnSpacing={12} rowSpacing={2} justify="center">
              {!loaded && <CenteredLoader />}
              {!noResults && loaded && companies.length === 0 && <NoResults />}

              {
                companies.map((company) => (
                  <CompanyCell company={company} />
                ))
              }
            </Grid>
          </Container>
        </div>
        <Footer />
      </main>
    </>
  );

  function CompanyCell({ company }) {
    const classes = useStyles();
    return (
      <Grid item xs={12} xm={6} xl={4}>
        <Card>
          <CardActionArea disableRipple>
            <Grid container spacing={0} paddingTop="30px" >
              <Grid item xs={3} >
                <CardHeader avatar={<Avatar src={company.logo} />} />
              </Grid>
              <Grid item xs={6} paddingTop="20px" >
                <Typography
                  variant="h5"
                  align="left"
                  verticalAlign="center"
                  gutterBottom
                >
                  <b>{company.companyName}</b>
                </Typography>

              </Grid>
              <Grid item xs={3} paddingTop="20px">

                <Link
                  to={company.companyName.toString()}
                  state={{ selectedCompany: company }}
                >
                  <IconButton>
                    <ArrowForward />
                  </IconButton>
                </Link>
              </Grid>

            </Grid>
            <CardContent className={classes.cardContent}>
              <Typography
                variant="body2"
                align="Left"
                color="text.Secondary"
                Wrap
              >
                {company.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid >
    );

  }
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


function NoResults() {
  return (

    <div style={{
      // center it
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      // style it
      padding: "20px",
      backgroundColor: "white",
      textAlign: "center"
    }}>
      <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
        No Results
      </Typography>
    </div>
  );
}
