import React from 'react';
import "./EditBox.css";
import ReadMoreText from './ReadMore'; 
// import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import axios from 'axios';
import {Card} from "@mui/material";


export default function EditBox({edit, item, arr}) {
    const [ed, setEdit] = React.useState(false);

    const [titleInput, setTitleInput] = React.useState(item.title);
    const [orgInput, setOrgInput] = React.useState(item.org);
    const [dateInput, setDateInput] = React.useState(item.date);
    const [textInput, setTextInput] = React.useState(item.text);

    const handleEdit = () => {
        setEdit(!ed);
        if (ed === true) {
            postEdit();
        }
    };

    const handleChange = (e) => {
        if (e.target.id === "title") {
            setTitleInput(e.target.value);
        } else if (e.target.id === "org") {
            setOrgInput(e.target.value);
        } else if (e.target.id === "date") {
            setDateInput(e.target.value);
        } else if (e.target.id === "text") {
            setTextInput(e.target.value);
        }
    };

    function postEdit() {
        let entry = {id: item.id, title: titleInput, org: orgInput, date: dateInput, text: textInput};
        let path = "http://localhost:5002/get_edit" + arr;

        axios
            .post(path, {
                entry
            },
            )
            .then((response) => {

            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                
            });
    }

    let itemObj;
    
    if (edit === true) {
        if (ed === false) {
            itemObj =  (
                <Card raised={true} className = "overallCont">
                    <div className = "head">
                        <div>
                            <h3>Section</h3>
                        </div>
                        <div className = "ic" onClick = {handleEdit}>
                            { ed ?
                            <DoneIcon fontSize = "medium"/>
                            :
                            <EditIcon fontSize = "medium"/>
                            }   
                        </div>
                    </div>
                    <div className = "oneBoxEdit">
                        <div className = "info"><h4>{titleInput}</h4>{orgInput}<br></br>{dateInput}</div>
                        <div className = "field"> 
                            <ReadMoreText text = {
                                <div>{textInput}</div>
                            } />
                        </div>
                    </div>
                </Card>
            );
        }
        else {
            itemObj = (
                <Card raised={true} className = "overallCont">
                    <div className = "head">
                        <div>
                            <h3>Section</h3>
                        </div>
                        <div className = "ic" onClick = {handleEdit}>
                            { ed ?
                            <DoneIcon fontSize = "medium"/>
                            :
                            <EditIcon fontSize = "medium"/>
                            }   
                        </div>
                    </div>
                    <div className = "oneBoxEdit">
                        <div className = "info">
                            <h4>
                                <input id = "title" type="text" value={titleInput} onChange={handleChange}/>
                            </h4>
                            <input id = "org" type="text" value={orgInput} onChange={handleChange}/><br></br>
                            <input id = "date" type="text" value={dateInput} onChange={handleChange}/>
                        </div>
                        <div className = "field"> 
                            <input id = "text" type="text" className = "textField" value={textInput} onChange={handleChange}/>
                        </div>
                    </div>
                </Card>
            )
        }
    }
    else {
        itemObj = (
            <div className = "oneBox">
                <div className = "info"><h4>{titleInput}</h4>{orgInput}<br></br>{dateInput}</div>
                <div className = "field"> 
                    <ReadMoreText text = {
                        <div>{textInput}</div>
                    } />
                </div>
            </div>
        );
    }

    return (
        <div>{itemObj}</div>
    );
}