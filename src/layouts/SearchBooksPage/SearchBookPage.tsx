import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const SearchBookPage = () => {

    const[books, setBooks] = useState<BookModel[]>([]);
    const[isLoading, setIsLoading] = useState(true);
    const[httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = "http://localhost:8080/api/books";
            const url: string = `${baseUrl}?page=0&size=5`;
            const response = await fetch(url);

            if(!response.ok) {
                throw new Error('Something is not ok.')
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;
            const loadedBooks: BookModel[] = [];

            for(const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error:any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    if(isLoading) {
        return (
            <SpinnerLoading/>
        )
    }

    if(httpError) {
        return (
            <div className="container m-5">
                <p className="text-danger">{httpError}</p>
            </div>
        )
    }

    return (
        <div>
            
        </div>    
    );
}