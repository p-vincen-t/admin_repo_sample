const ErrorPage = ({ statusCode }) => {
    return (
        <div>
            <p>
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : "An error occurred on client"}
            </p>
        </div>
    );
};

ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
};

export default ErrorPage;
