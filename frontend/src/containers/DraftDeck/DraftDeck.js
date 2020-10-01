import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import DraftSpace from "./DraftSpace/Draftspace";
import classes from "./DraftDeck.module.css";
import DraftDeckControls from "./DraftDeckControls/DrafDeckControls";
import Grid from '@material-ui/core/Grid';
import RecommendationDeck from "../RecommendationDeck/RecommendationDeck";

export default class DraftDeck extends Component {


    state = {
        showRecommendations: false,
        userTextInput: {
            title : '',
            content : ''
        }
    };

    changeUserTextInput = (event) => {

        const name = event.target.name; 
        const value = event.target.value; 

        console.log(name, value);
        
        /**
         * This is always a bit of a pain in the ass to remember. A few things. First,
         * this is an asynchronous call to setState, which means we have to save the fields
         * in the event object because React pools and recycles events. Futher, we have to 
         * spread out the objects 
         */
        this.setState(prevState => {
            return {
                ...prevState,
                userTextInput : {
                    ...prevState.userTextInput,
                    [name] : value
                }
            }
        });
    }

    toggleTalkModeHandler = () => {
        alert("Switched to talk mode");
    };

    toggleRecommendationDeck = () => {
        this.setState((prevState) => {
            return {
                showRecommendations: !prevState.showRecommendations
            }
        });

        console.log("showing recommendations !");
    }


    render() {

        const gridSize = this.state.showRecommendations ? 6 : 12

        return (

            <Card
                className={classes.DraftDeck}
                variant="outlined"
            >

                <DraftDeckControls
                    talked={this.toggleTalkModeHandler}
                    submitted={this.toggleRecommendationDeck}
                />

                <hr />

                <Grid container
                    direction="row"
                >

                    <Grid item sm={gridSize}>
                        <DraftSpace
                        userTextInput={this.state.userTextInput}
                        changeUserTextInput={this.changeUserTextInput}
                        />
                    </Grid>

                    {this.state.showRecommendations ?
                        <Grid item sm={gridSize} className={classes.RecommendationDeck}>
                            <RecommendationDeck 
                                userTextInput={` ${this.state.userTextInput.title} ${this.state.userTextInput.content}` }
                            />
                        </Grid>
                        : null
                    }

                </Grid>

            </Card>

        )

    }
}
