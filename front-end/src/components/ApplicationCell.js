import { useState, useEffect } from "react";
import { Stack } from "@mui/system";
import {
  Avatar,
  Card,
  CardHeader,
  Typography,
  IconButton,
  CardActionArea,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import useStyles from "./InternshipsStyles";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import "./InProgress.css";
import SeeAll from './SeeAll';


export default function ApplicationCell({ application }) {
  const classes = useStyles();
  let path = "/ReviewPage";
  const { user } = useAuthContext();

  const [notes, setNotes] = useState([]);

  const fetchArrs = () => {
    axios
    .post("http://localhost:5002/post_notes", {
        email: user.email, id: application.internshipID
    })
    .then((response) => {
        setNotes(response.data);
    })
    .catch((err) => {
    })
  };


  useEffect(() => {
    fetchArrs();
  }, []);

  const handleNote = () => {
    // setWorkExp(workExp.push({ title: 'Title', org: 'Organization/Project', date:'Date', text: "Description" }));
    let entry = [user.email, application.internshipID, { title: "Title", date: "Date", text: "Description" }];
    axios
        .post('http://localhost:5002/post_newNote', {
            entry
        },
        )
        .then((response) => {
            setNotes(notes => [...notes, response.data]);
        })
        .catch((err) => {
            console.log(err);
        })
  };

  const handleClick = () => {
      handleNote();
  };

  return (
    <Card className={classes.card}>
      <CardActionArea disableRipple>
        <CardHeader
          avatar={
            <Avatar
              src={
                application.companyLogo !== ""
                  ? application.companyLogo
                  : "https://source.unsplash.com/random/"
              }
            />
          }
          action={
            <Link
              to={application.internshipID.toString()}
              state={{ selectedApplication: application }}
            >
              {/* <IconButton>
                <ArrowForward />
              </IconButton> */}
            </Link>
          }
          title={application.positionName}
          subheader={application.companyName}
        />
        <Stack direction="row" alignItems="center">
          <Stack direction="row" paddingLeft="20px">
            <div onClick = {handleClick}>
              <IconButton>
                <Typography paddingRight="5px">Add Note</Typography>

                <AddCircleIcon />
              </IconButton>
            </div>
            
          </Stack>

          <Link
            style={{ textDecoration: "none" }}
            to={path}
            state={{ selectedApplication: application }}
          >
            <Stack direction="row" paddingLeft="20px">
              <IconButton>
                <Typography paddingRight="5px">Move to Accepted</Typography>
                <ArrowCircleRightIcon />
              </IconButton>
            </Stack>
          </Link>
        </Stack>
        
        <div className = "contNotes">
          <SeeAll items={notes} state = {true} edit={true} arr = "Notes" internshipID = {application.internshipID}/>
        </div>

      </CardActionArea>
    </Card>
  );
}