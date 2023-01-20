import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel";


export const CheckoutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean, 
    currentLoansCount: number, isAuthenticated: any, isCheckedOut: boolean , checkoutBook: any}> = (props) => {
    
    function buttonRender () {
        if(props.isAuthenticated) {
            if(!props.isCheckedOut && props.currentLoansCount < 5) {
                return(<button className="btn btn-success btn-lg" onClick={() => props.checkoutBook()}>Checkout</button>)
            } else if (props.isCheckedOut) {
                return(<p><b>Book checked out. Enjoy!</b></p>)
            } else if (!props.isCheckedOut) {
                return(<p className="text-danger">Too many books cheched out.</p>)
            }
        }
        return (<Link to="/login" className="btn btn-success btn-lg">Sign in</Link>)
    }
    
    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className="card-body container">
                <div className="mt-5">
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className="text-success">
                            Availiable
                        </h4>
                        :
                        <h4 className="text-danger">
                            Wait list
                        </h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable} </b>
                            availiable
                        </p>
                    </div> 
                </div>
                {buttonRender()}
                <hr/>
                <p className="mt-3">
                    This number can change until placing order has been complete.
                </p>
                <p>
                    Sign in to be able to leave review.
                </p>
            </div>
        </div>
    );
}