"use client";

import SearchInput from "@/components/SearchInput/SearchInput";
import {Flex} from "@mantine/core";
import AdvancedSearchFilters from "@/components/AdvancedSearch/AdvancedSearchFilters/AdvancedSearchFilters";
import {useSearchParams} from "next/navigation";
import classes from './AdvancedSearch.module.css';
import {AdvancedSearchContext} from "@/utils/Contexts/Contexts";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/shikimori/client";
import getAllSearchParams from "@/utils/Misc/getAllSearchParams";

const LIMIT = 32;

export default function AdvancedSearch() {
    const shikimori = client();
    const searchParams = useSearchParams();
    const {
        censored,
        durations,
        demographicGenres,
        genreGenres,
        themeGenres,
        kinds,
        limit,
        order,
        ratings,
        score,
        year,
        rangedYears,
        yearsRanged,
        seasons,
        statuses,
        studio
    } = getAllSearchParams(searchParams);

    const [input, setInput] = useState('');
    const { data, isPending, error } = useQuery({
        queryKey: [
            'advancedSearch',
            censored,
            durations,
            demographicGenres,
            genreGenres,
            themeGenres,
            kinds,
            limit,
            order,
            ratings,
            score,
            year,
            rangedYears,
            yearsRanged,
            seasons,
            statuses,
            studio,
            input,
        ],
        queryFn: getShikimoriData,
    });

    const queryCensored = censored === "true";
    const queryDuration = durations.toString();
    const queryRating = ratings.toString();
    const queryScore = score.toString();
    const queryStatus = statuses.toString();
    const queryStudio = studio;

    const areYearsRanged = yearsRanged === "true";
    const yearWithSeasons = seasons.length
        ? (seasons.map((season) => {
            return `${season}_${year}`;
        })).toString()
        : year.toString();

    const queryYear = areYearsRanged
        ? `${rangedYears[0]}_${rangedYears[1]}`
        : yearWithSeasons;

    let queryGenres: string = '';

    console.log(queryGenres)

    const queryKinds = kinds.toString();
    const queryOrder = order;

    console.log(data, isPending, error);
    async function getShikimoriData() {
        return (await shikimori
            .animes
            .list({
                search: input,
                censored: queryCensored,
                durations: queryDuration,
                rating: queryRating,
                score: queryScore,
                status: queryStatus,
                studio: queryStudio,
                genre: queryGenres,
                year: queryYear,
                order: queryOrder,
                kind: queryKinds,
                limit: LIMIT,
                filter: [
                    "id",
                    "url",
                    "russian",
                    "status",
                    "score",
                    "poster { id originalUrl mainUrl }",
                    "episodes",
                    "episodesAired"
                ]
            })
        ).animes;
    }

    return (
        <AdvancedSearchContext.Provider
            value={{
                searchInput: input,
                setSearchInput: setInput
            }}
        >
            <Flex className={classes.wrapper}>
                <SearchInput />
                <AdvancedSearchFilters />
            </Flex>
        </AdvancedSearchContext.Provider>
    );
}
