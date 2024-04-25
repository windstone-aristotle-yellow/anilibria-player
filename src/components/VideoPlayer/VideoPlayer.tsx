import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {MediaPlayer, MediaPlayerInstance, MediaProvider, Menu, useMediaStore} from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import {useRef, useState} from 'react';
import videoPlayerTranslation from '../../configs/videoPlayerTranslation.json';
import classes from './VideoPlayer.module.css';
import {PlaylistIcon} from "@vidstack/react/icons";
import {Button, Text} from "@mantine/core";

interface VideoPlayerProps {
    title?: string;
    player: {
        host: string;
        list: {
            episode: string;
            hls: {
                fhd?: string;
                hd?: string;
                sd?: string;
            }
        }[]
    };
    preview?: string;
}
interface VideoPlaylistProps {
    fhd?: string;
    hd?: string;
    sd?: string;
}

function changeEpisode({ player }: VideoPlayerProps, episode: number) {
    const host = `https://${player.host}`;
    const source = player.list[episode].hls;

    const dataHLS: VideoPlaylistProps = {
        fhd: '#EXT-X-STREAM-INF:RESOLUTION=1920x1080\n',
        hd: '#EXT-X-STREAM-INF:RESOLUTION=1280x720\n',
        sd: '#EXT-X-STREAM-INF:RESOLUTION=720x480\n',
    };

    let playlistHLS = '';

    for (const [key, value] of Object.entries(source)) {
        if (value !== null) {
            // @ts-ignore
            playlistHLS = `${playlistHLS}\n${dataHLS[key]}${host}${value}`;
        }
    }

    const playlistSource = `#EXTM3U\n#EXT-X-VERSION:3\n${playlistHLS}`;

    const blob = new Blob([playlistSource], {
        type: 'application/x-mpegurl',
    });

    return URL.createObjectURL(blob);
}

export default function VideoPlayer({ title, player, preview }: VideoPlayerProps) {
    const mediaPlayerRef = useRef<MediaPlayerInstance>(null);
    const { currentTime, duration, title: animeTitle } = useMediaStore(mediaPlayerRef);
    const [episodeSource, setEpisodeSource] = useState(changeEpisode({ player }, 1));
    const [hideMenu, setHideMenu] = useState('hidden');
    const [currentEpisode, setCurrentEpisode] = useState(1)

    const isLastTenSeconds = (duration - currentTime) <= 10
    const episodesAmount = Object.entries(player.list);

    const episodesList = episodesAmount.map((_value, index) => {
            const episodeIndex = index + 1;

            return (
                <Menu.Radio
                    className={
                        currentEpisode === episodeIndex ? classes.currentEpisodeButton : undefined
                    }
                    key={episodeIndex}
                    onClick={() => {
                            setCurrentEpisode(episodeIndex)
                            setEpisodeSource(changeEpisode({ player }, episodeIndex));
                        }
                    }
                >
                    Серия {episodeIndex}
                </Menu.Radio>);
        }
    );

    const episodesCount = episodesList.length
    const hasNextEpisode = (episodesCount - currentEpisode) > 0

    function setNextEpisode() {
        const nextEpisode = currentEpisode + 1

        setCurrentEpisode(nextEpisode)
        setEpisodeSource(changeEpisode({ player }, nextEpisode));
    }

    return (
        <div className={classes.wrapper}>
            <MediaPlayer
                onControlsChange={(isControlsShown) => {
                        if (!isControlsShown) {
                            setHideMenu('hidden');
                        } else {
                            setHideMenu('');
                        }
                    }
                }
                className={classes.player}
                title={title}
                aspect-ratio={16 / 9}
                src={
                    {
                        src: episodeSource,
                        type: 'application/x-mpegurl',
                    }
                }
                viewType="video"
                poster={preview}
                ref={mediaPlayerRef}
            >
                <MediaProvider />
                <DefaultVideoLayout icons={defaultLayoutIcons} translations={videoPlayerTranslation}>
                    <Menu.Root className={`${classes.playlist} ${classes[hideMenu]} vds-menu`}>
                        <Menu.Button className={`${classes.playlistButton} vds - menu - button vds-button`} aria-label="Chapter Switch">
                            <PlaylistIcon className={classes.playlistIcon} />
                        </Menu.Button>
                        <Menu.Items className="vds-menu-items" placement="bottom start" offset={0}>
                            <Menu.RadioGroup>
                                {episodesList}
                            </Menu.RadioGroup>
                        </Menu.Items>
                        <Text fw={700} className={classes.currentEpisodeMarker}>{currentEpisode} серия</Text>
                        {
                            isLastTenSeconds && hasNextEpisode
                                ? (
                                    <div className={classes.nextEpisode}>
                                        <Button className={classes.nextEpisodeButton} onClick={setNextEpisode}>Дальше</Button>
                                    </div>
                                )
                                : (
                                    <div className={classes.nextEpisode}></div>
                                )
                        }
                    </Menu.Root>
                </DefaultVideoLayout>
            </MediaPlayer>
        </div>
    );
}