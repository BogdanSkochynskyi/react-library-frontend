import { Carousel } from "./components/Carousel";
import { ExploteTopBooks } from "./components/ExploreTopBooks";
import { Heros } from "./components/Heros";
import { LibraryServices } from "./components/LibraryServices";

export const HomePage = () => {
    return (
        <>
            <ExploteTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
        </>
    );
}