import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

const Checkboxes = (props) => {

    const [scrapeaTargets, setScrapeTargets] = useState({
        includeIEP: true,
        includeSEP: true,
    });

    const handleChange = (event) => {

        const name = event.target.name;

        setScrapeTargets(prevState => {
            return { ...prevState, [name]: !prevState[name] }
        })

    };

    return (
        <FormGroup row>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.scrapeList.includeIEP}
                        onChange={(event) => props.onCheck({ name : event.target.name})}
                        name="includeIEP"
                    />
                }
                label="Include Results from IEP"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.scrapeList.includeSEP}
                        onChange={(event) => props.onCheck({ name : event.target.name})}
                        name="includeSEP"
                    />
                }
                label="Include Results from SEP"
            />
        </FormGroup>


    )
}

const mapDispatchToProps = dispatch => {
    return {
        onCheck: (payload) => dispatch(actions.updateScrapeList(payload))
    };
}

const mapStateToProps = state => {
    return {
        scrapeList: state.scrapeList
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkboxes);

