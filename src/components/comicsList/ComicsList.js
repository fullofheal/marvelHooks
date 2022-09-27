import React, { useState, useEffect} from 'react';
import { Link} from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        updateList(offset);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const updateList = (offset) => {
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const renderComics = (arr) => {
        const comics = arr.map((item, i) => {

            const {id, title, thumbnail, price} = item;
            return (
                <li className="comics__item"
                key={i}>
                        <Link to={`/comics/${id}`}>
                            <img src={thumbnail} alt={title} className="comics__item-img"/>
                            <div className="comics__item-name">{title}</div>
                            <div className="comics__item-price">{price}</div>
                        </Link>
                    </li>
                )
            
        })
        
        return (<ul className="comics__grid">
                {comics}
            </ul>)
    }
    
    const comics = renderComics(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {comics}
            <button className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': comicsEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;