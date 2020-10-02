import React, { Component } from "react";
import Aux from "../../components/hoc/Aux";
import RecommendationCard from "./RecommendationCard/RecommendationCard";
import classes from "./RecommendationDeck.module.css";
import RecommendationModal from "../../components/UI/Modals/RecommendationModal/RecommendationModal";
import Spinner from "../../components/UI/Spinner/Spinner";
import axios from "axios";
import withErrorHandler from "../../components/hoc/withErrorHandler";
import { connect } from 'react-redux';

const instance = axios.create();

// Currently, RecommendationConent is a static place-holder from what will later be
// dynamic content. Each recommendation card is populated with data from this object. 
// The recommendationModalContent is what is feed to the pop-up

class RecommendationDeck extends Component {

    state = {
        loadingRecommendations: true,
        showRecommendationModal: false,
        recommendations: [],
    }

    // We will make asynchronous requests from here. Right how, we
    // mock a three-second delay to verify that the spinner is working 
    async componentDidMount() {
        this.fetchRecommendations();
    }

    fetchRecommendations = async () => {

        // Make an async request to the backend using this method 
        const response = await instance.post(`http://localhost:4000/recommendations`, {
            textInput: this.props.userTextInput
        });


        // This will, at the very least, turn off the spinner
        this.setState({ loadingRecommendations: false });

        console.log(response);

        this.setState({ recommendations: response.data });

    };



    toggleRecommendationModal = () => {
        this.setState((prevState) => {
            return {
                showRecommendationModal: !prevState.showRecommendationModal
            }

        });



        console.log("expanding recommendation card!");
        console.log(this.state.showRecommendationModal);
    }

    setRecommendationModalContent = (newContent) => {

        this.setState({
            recommendationModalContent: {
                title: newContent.title,
                body: newContent.body,
                link: newContent.link
            }
        });

        console.log("ser new recommendation modal content!");
    }




    render() {
        return (
            <Aux>
                {this.state.loadingRecommendations ?
                    <Spinner />
                    : <Aux>
                        {this.state.showRecommendationModal ?
                            <RecommendationModal
                                content={this.state.recommendationModalContent}
                                show={this.state.showRecommendationModal}
                                clicked={this.toggleRecommendationModal}
                            />
                            : null
                        }
                        <div className={classes.RecommendationDeck}>
                            {
                                this.state.recommendations.map( (recommendation, idx) => {

                                    return (
                                        <RecommendationCard
                                            key={idx}
                                            content={recommendation}
                                            show={this.state.showRecommendationModal}
                                            clicked={this.toggleRecommendationModal}
                                            set={this.setRecommendationModalContent}
                                        />
                                    )
                                })
                            }
                        </div>
                    </Aux>


                }



            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
      userTextInput : state.userTextInput,
      scrapeList : state.scrapeList
    }
  };


export default connect(mapStateToProps)(withErrorHandler(RecommendationDeck, instance)); 