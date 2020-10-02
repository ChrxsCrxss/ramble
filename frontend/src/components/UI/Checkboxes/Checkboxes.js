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
                control={<Checkbox checked={scrapeaTargets.includeIEP} onChange={handleChange} name="includeIEP" />}
                label="Include Results from IEP"
            />
            <FormControlLabel
                control={<Checkbox checked={scrapeaTargets.includeSEP} onChange={handleChange} name="includeSEP" />}
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

export default connect(null, mapDispatchToProps)(Checkboxes); 

