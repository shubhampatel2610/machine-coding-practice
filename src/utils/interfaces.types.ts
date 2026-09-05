// Shape of a single homepage grid tile / route entry
export interface GridItem {
    id: string; // unique key, also used as mono "file index" badge seed
    name: string; // display title shown on the tile + page header
    description: string; // one-line summary shown on the tile
    route: string; // react-router path this tile links to
    tag: string; // short category label e.g. "React", "Hooks", "DOM"
}

export interface PlaygroundSource {
    tsx: string;
    scss: string;
}