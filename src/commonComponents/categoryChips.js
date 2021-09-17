import {Badge} from "react-bootstrap";

const CategoryChip = (props) => {
    const {name, variant} = props;
    return ( 
        <Badge className="badge_name" pill variant={variant ? variant : "primary"}>
            {name}
        </Badge>
     );
}
 
export default CategoryChip;