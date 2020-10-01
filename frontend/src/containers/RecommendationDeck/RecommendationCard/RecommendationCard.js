import React from "react";
import Card from '@material-ui/core/Card';
import classes from "./RecommendationCard.module.css";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';


const recommendationCard = (props) => {
    return (
        <Card
            className={ classes.RecommendationCard }>
            <strong>{props.content.title}</strong>
            <OpenInNewIcon 
            className={ classes.ExpandButton }
            onClick={ () => { props.set(props.content); props.clicked() } }
            />
            <br />
            <p>
                {props.content.intro}
            </p>
            <a href={props.content.url} target="_blank" rel="noopener noreferrer">Google?</a>
        </Card>
    )
}

export default recommendationCard; 