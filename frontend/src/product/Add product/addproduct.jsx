import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../Sidebar/sidebar.jsx';
import { showError,showSuccess , host} from '../../utils/toast.jsx';
import "./addproduct.css"; 

export const AddProduct = () => {
    const [productData, setProductData] = useState({
        product_name: '',
        product_bio: '',
        product_price: '',
        product_url: '',
        rating: '',
        category: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const key in productData) {
            if (!productData[key]) {
                showError(`Please fill out the ${key.replace('_', ' ')} field.`);
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showError("Authentication error. Please sign in again.");
                navigate("/signin");
                return;
            }

            const response = await axios.post(
                `${host}/add_product`, 
                productData, 
                { headers: { token } }
            );
            
            showSuccess(response.data.message || "Product added successfully!");
            navigate("/Dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to add product.";
            showError(errorMessage);
            console.error("Add Product Error:", error);
        }
    };

    // small derived values for preview
    const formattedPrice = productData.product_price ? `$${Number(productData.product_price).toFixed(2)}` : '';
    const previewImg = productData.product_url && productData.product_url.trim() !== '' ? productData.product_url : null;
    const initials = (productData.product_name || "P").trim().split(" ").filter(Boolean).slice(0,2).map(p => p[0]?.toUpperCase()).join("") || "P";

return (
    <div className="profile-dashboard-layout">
            <Sidebar />
            <main className="main-content">

                <header className="dashboard-header" style={{ marginBottom: 12 }}>
                    <div>
                        <h1 className="header-title">Add New Product</h1>
                        <p className="header-subtitle">Fill in the details to add a new item to the catalog.</p>
                    </div>
                </header>

                <div className="add-product-wrap">
                    <div>
                        <section className="add-card add-product-card" aria-labelledby="add-product-heading">
                            <h2 id="add-product-heading" style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 800, color: '#fff' }}>Product Details</h2>

                            <form onSubmit={handleSubmit} className="add-product-form" aria-describedby="form-help">
                                <div className="form-group">
                                    <label htmlFor="product_name">Product Name</label>
                                    <input
                                        type="text"
                                        id="product_name"
                                        name="product_name"
                                        value={productData.product_name}
                                        onChange={handleChange}
                                        placeholder="e.g., Wireless Headphones"
                                        aria-required="true"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="product_bio">Product Bio</label>
                                    <textarea
                                        id="product_bio"
                                        name="product_bio"
                                        value={productData.product_bio}
                                        onChange={handleChange}
                                        placeholder="A brief description of the product"
                                        rows="4"
                                        aria-required="true"
                                    ></textarea>
                                </div>

                                <div className="form-row" role="group" aria-label="price and rating">
                                    <div className="form-group">
                                        <label htmlFor="product_price">Price ($)</label>
                                        <input
                                            type="number"
                                            id="product_price"
                                            name="product_price"
                                            value={productData.product_price}
                                            onChange={handleChange}
                                            placeholder="e.g., 199.99"
                                            step="0.01"
                                            aria-required="true"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="rating">Rating (1-5)</label>
                                        <input
                                            type="number"
                                            id="rating"
                                            name="rating"
                                            value={productData.rating}
                                            onChange={handleChange}
                                            placeholder="e.g., 4.5"
                                            step="0.1"
                                            min="1"
                                            max="5"
                                            aria-required="true"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        value={productData.category}
                                        onChange={handleChange}
                                        placeholder="e.g., Electronics"
                                        aria-required="true"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="product_url">Product Image URL</label>
                                    <input
                                        type="url"
                                        id="product_url"
                                        name="product_url"
                                        value={productData.product_url}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        aria-describedby="image-help"
                                    />
                                    <div id="image-help" className="hint">Paste a direct image URL to preview it on the right.</div>
                                </div>

                                <button type="submit" className="submit-btn" aria-label="Add product">Add Product</button>
                            </form>
                        </section>
                    </div>

                    {/* RIGHT: Live Preview + Tips */}
                    <aside className="preview-column" aria-label="preview and tips">
                        <div className="preview-card">
                            <div className="preview-image" role="img" aria-label={productData.product_name || "Product preview"}>
                                {previewImg ? (
                                    <img src={previewImg} alt={productData.product_name || "Product image"} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                                ) : (
                                    <div aria-hidden="true" style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%' }}>
                                        <span style={{ fontSize: 40, fontWeight:800 }}>{initials}</span>
                                    </div>
                                )}
                            </div>

                            <div className="preview-meta">
                                <div>
                                    <div className="preview-name">{productData.product_name || 'Product title'}</div>
                                    <div className="hint" style={{ marginTop:6 }}>{productData.product_bio || 'A short product description will appear here.'}</div>
                                </div>
                                <div style={{ textAlign:'right' }}>
                                    <div className="preview-price">{formattedPrice || '--'}</div>
                                    <div className="hint" style={{ marginTop:6 }}>{productData.category || 'Category'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="preview-card tip" style={{ marginTop: 10 }}>
                            <div style={{ fontWeight:800, marginBottom:6 }}>Quick Tips</div>
                            <ul style={{ margin:0, paddingLeft:18 }}>
                                <li style={{ marginBottom:6 }}>Use a clear product image (800×800 recommended).</li>
                                <li style={{ marginBottom:6 }}>Keep titles short and searchable (3–6 words).</li>
                                <li>Write a benefit-focused bio — what problem does it solve?</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};
