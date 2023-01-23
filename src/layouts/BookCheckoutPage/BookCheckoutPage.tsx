import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./components/CheckoutAndReviewBox";
import { LatestReviews } from "./components/LatestReviews";

export const BookCheckoutPage = () => {

  const {authState} = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  //Review state
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  //Loans count state
  const [currentLoansCount, setCurrentLoansCounts] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

  //Is book cheched out
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something is not ok.");
      }

      const responseJson = await response.json();
      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

      const responseReviews = await fetch(reviewUrl);

      if (!responseReviews.ok) {
        throw new Error("Something is not ok.");
      }

      const responseJsonReviews = await responseReviews.json();
      const responseDataReviews = responseJsonReviews._embedded.reviews;
      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseDataReviews) {
        loadedReviews.push({
          id: responseDataReviews[key].id,
          userEmail: responseDataReviews[key].userEmail,
          date: responseDataReviews[key].date,
          rating: responseDataReviews[key].rating,
          book_id: responseDataReviews[key].bookId,
          reviewDescription: responseDataReviews[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + responseDataReviews[key].rating;
      }

      if (loadedReviews) {
        const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false)

    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft])

  useEffect(() => { 
        const fetchUserCurrentLoansCount = async () => {
          if (authState && authState.isAuthenticated) {
            const url = `http://localhost:8080/api/books/secure/currentloans/count`;
            const requestOptions = {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
              }
            };
            const currentLoansCountResponse = await fetch(url, requestOptions);
            if (!currentLoansCountResponse.ok) {
              throw new Error("Something is not ok.");
            }
            const currentLoansCountJson = await currentLoansCountResponse.json();
            setCurrentLoansCounts(currentLoansCountJson);
          }
          setIsLoadingCurrentLoansCount(false);
        }

        fetchUserCurrentLoansCount().catch((error: any) => {
          setIsLoadingCurrentLoansCount(false);
          setHttpError(error.message);
        });
  }, [authState, checkoutBook])

  useEffect(() => {
    const fetchUserReviewBook =async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const isUserReview = await fetch(url, requestOptions);
        if (!isUserReview.ok) {
          throw new Error("Something is not ok.");
        }
        const userReviewJson = await isUserReview.json();
        setIsReviewLeft(userReviewJson);
      }
      setIsLoadingUserReview(false);
    }
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState])

  useEffect(() => {
    const fetchUserChechedOutBook =async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const isCheckedBookByUserResponse = await fetch(url, requestOptions);
        if (!isCheckedBookByUserResponse.ok) {
          throw new Error("Something is not ok.");
        }
        const isCheckedBookByUserJson = await isCheckedBookByUserResponse.json();
        setIsCheckedOut(isCheckedBookByUserJson);
      }
      setIsLoadingBookCheckedOut(false);
    }

    fetchUserChechedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState])


  if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p className="text-danger">{httpError}</p>
      </div>
    );
  }

  async function checkoutBook() {
    const url = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      throw new Error("Something is not ok.");
    }

    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
        bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
    const url = `http://localhost:8080/api/reviews/secure`;
    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewRequestModel)
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
        throw new Error('Something went wrong!');
    }
    setIsReviewLeft(true);
}

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} 
          isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      {/* Mobile */}
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} 
        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
