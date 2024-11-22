import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import './index.scss';

export interface Props {
    rating: number
}

export default function StarRating(props: Props){
    const numStart = Math.round(props.rating / 2);
    const fullStar = [];
    const emptyStar = [];

    for(let i = 0; i < 5; i++){
        if (i < numStart){
            fullStar.push(i);
        }else{
            emptyStar.push(i);
        }
    }
    return(
        <div className="movie-rate">
            {fullStar.map(index =>
                <FaStar key={index}/>
            )}
            {emptyStar.map(index =>
                <FaRegStar key={index}/>
            )}
        </div>
    );
}