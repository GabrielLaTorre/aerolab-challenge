import { useState, useEffect } from "react";

const useProductSearch = (pageNumber) => {
    const [ loading, setLoading ] = useState(true);
    const [ products, setProducts ] = useState([]);
    const [ hasMore, setHasMore ] = useState(false);

    useEffect( () => {
        setLoading(true);
        fetch(`/products?page=${pageNumber}`)
        .then( response => response.json())
        .then( data => {
            if(data.products) {
                setProducts((prevData) => ([...prevData, ...data.products]));
            }
            setHasMore(data.products?.length > 0);
            setLoading(false);
        });
      } , [pageNumber]);
    return { products, loading, hasMore }
}

export default useProductSearch;