import * as React from "react";
import { Container, Stack } from "@mui/system";
import {
  Box,
  Typography,
  IconButton,
  CssBaseline,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { ArrowBack } from "@material-ui/icons";
import useStyles from "./InternshipDetailedStyles";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Footer from "./Footer";


export default function InternshipDetailed() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { selectedInternship } = useLocation().state;
  const { user } = useAuthContext();
  const [status, setStatus] = React.useState('');

  const handleChange = (event) => {
    setStatus(event.target.value);
    // console.log(status)
  };

  const handleClick = (event) => {
    event.preventDefault();

    const params = {
      "user": user.email,
      "companyName": selectedInternship.companyName,
      "internshipID": selectedInternship._id,
      "positionName": selectedInternship.positionName,
      "companyLogo": selectedInternship.companyLogo,
      "locations": selectedInternship.locations,
      "status": status // from dropdown 
    }
    // console.log(params);

    axios
        .post('http://localhost:5002/post_applications', {
            params
        },
        )
        .then((response) => {
            let appData = response.data;
            // console.log(appData)
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            
        });
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">{selectedInternship.companyName}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div>
          <Container maxWidth="md" className={classes.mainContainer}>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" className={classes.horizontalStack}>
                <Typography variant="h10" className={classes.dataLabel}>
                  Position title:
                </Typography>
                <Typography variant="h10">
                  {selectedInternship.positionName}
                </Typography>
              </Stack>
              <Stack direction="row" className={classes.horizontalStack}>
                <Typography variant="h10" className={classes.dataLabel}>
                  Deadline:
                </Typography>
                <Typography variant="h10">Not yet</Typography>
              </Stack>
              <Stack direction="row" className={classes.horizontalStack}>
                <Typography variant="h10" className={classes.dataLabel}>
                  Posted time:
                </Typography>
                <Typography variant="h10">Not yet</Typography>
              </Stack>
              <Stack direction="row" className={classes.horizontalStack}>
                <Typography variant="h10" className={classes.dataLabel}>
                  Requirements:
                </Typography>
                <Stack direction="column" spacing={0.3}>
                  Not yet
                  {/* {selectedInternship.requirements.map((requirement) => (
                    <Typography variant="h10">{requirement}</Typography>
                  ))} */}
                </Stack>
              </Stack>
              <Stack direction="row" className={classes.horizontalStack}>
                <Typography variant="h10" className={classes.dataLabel}>
                  Location:
                </Typography>
                <Typography variant="h10">
                  {selectedInternship.locations}
                </Typography>
              </Stack>
            </Stack>
            <Box textAlign="center" className={classes.applyButton}>
              <Button
                variant="contained"
                size="medium"
                href={selectedInternship.url}
              >
                Apply
              </Button>
            </Box>
            <Box sx={{ minWidth: 60 }}>

            </Box> 
            <Box textAlign="center" className={classes.applyButton}>
              <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="status">Status</InputLabel>
                    {/* make the width of the select same as the submit  */}


                    <Select
                    size = "small"
                    labelId="select-label"  
                    id="status"
                    required
                    value={status}
                    label="Status"
                    onChange={handleChange}
                    // defaultValue={"saved"}
                    >
                    <MenuItem value={"saved"}>Saved</MenuItem>
                    <MenuItem value={"in-progress"}>In-Progress</MenuItem>
                    <MenuItem value={"accepted"}>Accepted</MenuItem>
                    </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleClick}
                  sx={{ minWidth: 200 }}
                >
                  Save Application
                </Button>
            </Box>
          </Container>
        </div>
        <Footer />
      </main>
    </>
  );
}
