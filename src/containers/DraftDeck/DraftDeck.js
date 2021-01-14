import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import DraftSpace from "./DraftSpace/Draftspace";
import classes from "./DraftDeck.module.css";
import DraftDeckControls from "./DraftDeckControls/DrafDeckControls";
import Grid from '@material-ui/core/Grid';
import RecommendationDeck from "../RecommendationDeck/RecommendationDeck";
import { connect } from 'react-redux';
import Checkboxes from '../../components/UI/Checkboxes/Checkboxes';

class DraftDeck extends Component {


    state = {
        showRecommendations: false,
    };

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
                        <DraftSpace/>
                        <Checkboxes/>
                    </Grid>

                    {this.state.showRecommendations ?
                        <Grid item sm={gridSize} className={classes.RecommendationDeck}>

                            <Card>
                                <p>
                                    Showing Recommendations for: <strong><em>{this.props.userTextInput.title}</em></strong>
                                </p>
                            </Card>
                            <RecommendationDeck />
                        </Grid>
                        : null
                    }

                </Grid>

            </Card>

        )

    }
}

const mapStateToProps = state => {
    return {
        userTextInput : state.userTextInput
    }
}

export default connect(mapStateToProps)(DraftDeck); 