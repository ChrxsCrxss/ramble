import React from "react";
import Button from '@material-ui/core/Button';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import MenuBookIcon from '@material-ui/icons/MenuBook';


/*

| Delete | Save | Talk | Share |

*/


const draftDeckControls = (props) => {


    return (

        <div>

            <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<KeyboardVoiceIcon />}
                onClick={props.talked}
            >
                Talk
            </Button>

            <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<MenuBookIcon />}
                onClick={props.submitted}
            >
                See Recommendations
            </Button>



        </div>


    )
}

export default draftDeckControls; 