'use client';

import { useEffect, useState, useRef } from 'react';
import './index.scss';
import axios from 'axios';
import MovieCard from '../moviecard';
import { Movie } from '@/types/movie';
import React from 'react';
import ReactLoading from 'react-loading';

export default function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1); 
    const [hasMore, setHasMore] = useState<boolean>(true); 

    const loader = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        getMovies(page); // carregando os filmes da página atual
    }, [page]);

    const getMovies = async (page: number) => {
        setIsLoading(true);
        await axios({
            method: 'get',
            url: 'https://api.themoviedb.org/3/discover/movie',
            params: {
                api_key: 'e649f807cd4aa90558e1b59b9999b518',
                language: 'pt-BR',
                page: page,
            },
        }).then((response) => {
            const newMovies = response.data.results;

            // verificando se tem filmes duplicados e adicionando apenas os novos
            setMovies((prevMovies) => {
                const uniqueMovies = newMovies.filter(
                    (newMovie: Movie) => !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
                );
                return [...prevMovies, ...uniqueMovies];
            });

            setHasMore(newMovies.length > 0); //vendo se tem mais filmes para carregar
        });
        setIsLoading(false);
    };

    // hookzinho para ver o fim da lista e carregar mais filme
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                setPage((prevPage) => prevPage + 1); // carrega proxima pagina
            }
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [hasMore, isLoading]);

    if (isLoading && movies.length === 0) {
        return (
            <div className="loading-container">
                <ReactLoading type="spin" color="#6046ff" height={'5%'} width={'5%'} />
            </div>
        );
    }

    return (
        <>
            <ul className="movie-list">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </ul>
            {hasMore && !isLoading && (
                <div ref={loader} className="loading-container">
                    <ReactLoading type="spin" color="#6046ff" height={'5%'} width={'5%'} />
                </div>
            )}
        </>
    );
}
