import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function Checkboxes(props) {

    const [state, setState] = React.useState({
        checkedIEP: true,
        checkedSEP: true,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };


    return (
        <FormGroup row>
            <FormControlLabel
                control={<Checkbox checked={state.checkedIEP} onChange={handleChange} name="checkedIEP" />}
                label="Include Results from IEP"
            />
            <FormControlLabel
                control={<Checkbox checked={state.checkedSEP} onChange={handleChange} name="checkedSEP" />}
                label="Include Results from SEP"
            />


        </FormGroup>


    )
}