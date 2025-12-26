import "./productcard.css"
import { ShoppingCart, Star} from "lucide-react";

export const Productcard=({productfilter , OnAddtocart })=>{
    
    return (
        <section className="products-section">
          <div className="products-grid">
            {(productfilter.length == 0)?
            <div className="no-results-found"> No matching products </div>:
            (productfilter.map((product, idx) => (
              <article
                className="product-card"
                key={product.product_id}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="product-image-wrapper">
                  <img
                    src={product.product_url}
                    alt={product.product_name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://t4.ftcdn.net/jpg/03/14/87/31/360_F_314873127_zzmrmYehdyx15XyOs3zzwZX00WwUiR5Y.jpg";
                    }}
                  />
                  <div className="product-overlay">
                    <button
                      className="btn-cart"
                      onClick={() => OnAddtocart(product.product_id)}
                      title="Add to cart"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                  {product.rating && (
                    <div className="rating-badge">
                      <Star size={14} fill="currentColor" />
                      <span>{parseFloat(product.rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="product-details">
                  {product.category && (
                    <span className="product-category">{product.category}</span>
                  )}
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-description" title={product.product_bio}>
                    {product.product_bio}
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      ₹{parseFloat(product.product_price).toFixed(2)}
                    </span>
                    <button
                      className="btn-add-cart"
                      onClick={() => OnAddtocart(product.product_id)}
                    >
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </article>
            )))}
          </div>
        </section>
    )
}