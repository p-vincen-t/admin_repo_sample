
const withLoading = (Component) => {

    // const [loading, setLoading] = useState(true)

    const combinedProps = { ...this.props};
    return (        
        <Component  {...combinedProps} />
    )
}

export default withLoading