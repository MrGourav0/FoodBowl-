import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ShopSection = () => {
  const city = useSelector((state) => state.user.city);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL ;

  useEffect(() => {
    if (city) {
      setLoading(true);
      setError(null);
      axios.get(`${serverUrl}/api/shop/city/${city}`)
        .then(res => {
          setShops(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setError("Failed to load shops. Please try again.");
          setLoading(false);
        });
    }
  }, [city]);

  const selectShop = (shop) => {
    setSelectedShop(shop);
    setLoading(true);
    setError(null);
    axios.get(`${serverUrl}/api/item/shop/${shop._id}`)
      .then(res => {
        setItems(res.data.items || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to load items. Please try again.");
        setLoading(false);
      });
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      item,
      shopId: selectedShop._id,
      shopName: selectedShop.name
    }));
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'alert alert-success position-fixed';
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `✅ ${item.name} added to cart!`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };


  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Choose Your Shop</h2>
      {!selectedShop ? (
        <div>
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading shops...</p>
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {!loading && !error && (
            <div className="row">
              {shops.length === 0 ? (
                <div className="col-12 text-center">
                  <div className="alert alert-info">
                    <h5>No shops available in your city.</h5>
                    <p>Please check back later or try a different location.</p>
                  </div>
                </div>
              ) : (
                shops.map(shop => (
                  <div className="col-md-4 mb-3" key={shop._id}>
                    <div className="card h-100 shadow-sm" onClick={() => selectShop(shop)} style={{ cursor: 'pointer' }}>
                      <div className="card-body">
                        <h5 className="card-title">{shop.name}</h5>
                        <p className="card-text text-muted">{shop.address}</p>
                        {shop.items && (
                          <small className="text-info">{shop.items.length} items available</small>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button className="btn btn-success mb-3" onClick={() => setSelectedShop(null)}>← Back to Shops</button>
          <h3>{selectedShop.name} Menu</h3>
          
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading menu items...</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <div className="row">
              {items.length === 0 ? (
                <div className="col-12 text-center">
                  <div className="alert alert-info">
                    <h5>No items available for this shop.</h5>
                    <p>Please check back later or try another shop.</p>
                  </div>
                </div>
              ) : (
              items.map(item => (
                <div className="col-md-4 mb-3" key={item._id}>
                  <div className="card h-100 shadow-sm">
                    {item.image && (
                      <img
                        src={item.image}
                        className="card-img-top"
                        alt={item.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text text-muted">{item.category}</p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-black">₹{item.price}</span>
                        <span className={`badge ${item.foodType === 'veg' ? 'bg-success' : 'bg-danger'}`}>
                          {item.foodType.toUpperCase()}
                        </span>
                      </div>
                      {item.rating && item.rating.count > 0 && (
                        <div className="mb-2">
                          <small className="text-warning">
                            ⭐ {item.rating.average.toFixed(1)} ({item.rating.count} reviews)
                          </small>
                        </div>
                      )}
                      <button
                        className="btn btn-success mt-auto"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopSection;
