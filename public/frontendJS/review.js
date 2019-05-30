//add functions for displaying error messages
//add function for submitting form through AJAX

(function ($) {
  
    let reviewForm = $("#review-form"),
        rating = $("#rating").change(
            function () {
                return $(this).children("option:selected").val();
            }),
        review = $("#content"),
        message = $("#message-container")
    let venueId = reviewForm[0].dataset.venueid
    let userId = reviewForm[0].dataset.userid

    console.log(reviewForm, venueId);
    if (reviewForm) {
        reviewForm.submit(function (event) {
            // console.log(reviewForm, rating, review, message)
            event.preventDefault();

            let ratingVal = rating.val();
            let reviewContent = review.val();

            console.log(`Rating:${ratingVal} \nReview:${reviewContent}`)

            if (ratingVal) {
                let useJson = true;
                if (useJson) {
                    let requestConfig = {
                        method: "POST",
                        url: `/venues/${userId}/${venueId}/reviewadded`,
                        contentType: "application/json",
                        data: JSON.stringify({
                            ratingVal: ratingVal,
                            reviewContent: reviewContent
                        })
                    };

                    $.ajax(requestConfig).then(function (responseMessage) {
                        console.log(responseMessage);
            
                        message.append("<p id='review-added'>Review has been successfully added</p>");
                        setTimeout(function(){
                            $('#review-added').remove();
                        }, 5000);
                        location.reload(true);
                    });
                }
            }
        })
    }
    
})(window.jQuery)